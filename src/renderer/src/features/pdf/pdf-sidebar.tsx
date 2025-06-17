"use client";

import { useQuery } from "@tanstack/react-query";
import { MessageSquare, PenLine } from "lucide-react";
import { useMemo, useState } from "react";

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
} from "@renderer/components/ui/sidebar";
import { queryKey } from "@renderer/constants";
import { cn } from "@renderer/lib";
import { GetPaperById } from "@renderer/services/papers";
import PdfSidebarAi from "./pdf-sidebar-ai";
import AnnotaionCard from "./annotations";
import { getRouteApi } from "@tanstack/react-router";

type TabType = "ask" | "notes" | "annotations";
export type RightSidebarTabProps = {
  content: string;
  paperId: string;
};
export function RightSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const [activeTab, setActiveTab] = useState<TabType>("ask");
const route = getRouteApi("/pdf/$id")
const {id:paperId} = route.useParams()

  const { data: paperData } = useQuery({
    queryKey: [queryKey.paper, paperId],
    queryFn: () => GetPaperById(paperId),
    enabled: !!paperId,
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });

  const content = useMemo(() => {
    return paperData?.data?.content ?? "";
  }, [paperData?.data?.content]);
  return (
    <Sidebar side="right" variant="floating" {...props}>
      <SidebarHeader className="p-3 flex justify-between items-center border-b">
        <div className="grid grid-cols-3 w-full rounded-full bg-background p-1 gap-2">
          <TabButton
            active={activeTab === "ask"}
            onClick={() => setActiveTab("ask")}
            icon={<MessageSquare className="h-4 w-4" />}
            label="Ask AI"
          />
          <TabButton
            active={activeTab === "notes"}
            onClick={() => setActiveTab("notes")}
            icon={<PenLine className="h-4 w-4" />}
            label="Notes"
          />
          <TabButton
            active={activeTab === "annotations"}
            onClick={() => setActiveTab("annotations")}
            icon={<div className="h-4 w-4 bg-green-500 rounded-full"></div>}
            label="Annotations"
          />
        </div>
      </SidebarHeader>

      <SidebarContent className="flex flex-col h-full p-0">
        {activeTab === "ask" && (
          <PdfSidebarAi paperId={paperId} content={content} />
        )}

        {activeTab === "notes" && (
          <div className="p-4">
            <p className="text-muted-foreground">
              Notes feature coming soon...
            </p>
          </div>
        )}

        {activeTab === "annotations" && (
          <AnnotaionCard paperId={paperId} content={content} />
        )}
      </SidebarContent>
    </Sidebar>
  );
}

interface TabButtonProps {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}

function TabButton({ active, onClick, icon, label }: TabButtonProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "rounded-full p-2 flex items-center justify-center gap-1 transition-all cursor-pointer text-xs",
        active ? "bg-muted shadow-sm" : "hover:bg-white/5"
      )}
    >
      {icon}
      <span className="hidden sm:inline">{label}</span>
    </button>
  );
}
