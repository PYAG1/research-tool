"use client";

import { MessageSquare, PenLine } from "lucide-react";

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@renderer/components/ui/tabs";
export function AiNotesTabs() {
  return (
    <div className="max-w-3xl mx-auto p-4">
      <Tabs defaultValue="ask" className="w-full">
        <TabsList className="grid grid-cols-3 w-full rounded-full bg-[#fae8dd] p-1">
          <TabsTrigger
            value="ask"
            className="rounded-full data-[state=active]:bg-white data-[state=active]:shadow-sm flex items-center justify-center gap-2"
          >
            <MessageSquare className="h-4 w-4" />
            <span>Ask AI</span>
          </TabsTrigger>
          <TabsTrigger
            value="notes"
            className="rounded-full data-[state=active]:bg-white data-[state=active]:shadow-sm flex items-center justify-center gap-2"
          >
            <PenLine className="h-4 w-4" />
            <span>Notes</span>
          </TabsTrigger>
          <TabsTrigger
            value="annotations"
            className="rounded-full data-[state=active]:bg-white data-[state=active]:shadow-sm flex items-center justify-center gap-2"
          >
            <div className="h-4 w-4 bg-green-500 rounded-full"></div>
            <span>Annotations</span>
          </TabsTrigger>
        </TabsList>
        <TabsContent value="ask" className="mt-6">
          <div className="p-4 border rounded-lg">
            <h3 className="text-lg font-medium">Ask AI</h3>
            <p className="text-muted-foreground">
              Ask questions about your content.
            </p>
          </div>
        </TabsContent>
        <TabsContent value="notes" className="mt-6">
          <div className="p-4 border rounded-lg">
            <h3 className="text-lg font-medium">Notes</h3>
            <p className="text-muted-foreground">
              Take notes while reviewing your content.
            </p>
          </div>
        </TabsContent>
        <TabsContent value="annotations" className="mt-6">
          <div className="p-4 border rounded-lg">
            <h3 className="text-lg font-medium">Annotations</h3>
            <p className="text-muted-foreground">
              View and manage your annotations.
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
