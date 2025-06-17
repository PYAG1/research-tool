import { SkullIcon, TrashIcon } from "@phosphor-icons/react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@renderer/components/ui/card";
import PaperDetailsDialog from "./paper-details-dialog";
import { SwapIcon } from "@phosphor-icons/react/dist/ssr";
import { BookOpen, Download, Info, RefreshCcw } from "lucide-react";
import moment from "moment";
import React from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuSeparator,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
} from "@renderer/components/ui/context-menu";
import { queryKey } from "@renderer/constants";
import { GetAllCategories } from "@renderer/services/category";
import {
  DeletePaperMutation,
  GetPaperById,
  UpdatePaperMutation,
} from "@renderer/services/papers";
import { toast } from "sonner";
import { useNavigate } from "@tanstack/react-router";

// Augment the Window interface for TypeScript to recognize the 'electron' object
// exposed by a preload script, which includes ipcRenderer capabilities.
declare global {
  interface Window {
    electron?: {
      ipcRenderer?: {
        invoke: (channel: string, ...args: any[]) => Promise<any>;
        // If other ipcRenderer methods are exposed and used (e.g., send, on),
        // add their signatures here as well.
      };
      // If other APIs are exposed on window.electron, define them here.
    };
  }
}





interface PaperCardProps {
  id: string;
  pdf_path: string;
  year: string;
  category: string;
  title: string;
  author: string[];
  is_deleted: boolean;
  // bgColor: string;
}

export default function PaperCard({
  year,
  category,
  title,
  author,
  id,
  pdf_path,
  is_deleted,
}: PaperCardProps) {
  const nav = useNavigate();
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);

  const { data: paperDetailsData } = useQuery({
    queryKey: [queryKey.paper, id],
    queryFn: () => GetPaperById(id),
    enabled: isDialogOpen, // Only fetch when dialog is opened
    staleTime: 60000,
  });

  const { data } = useQuery({
    queryKey: [queryKey.categories],
    queryFn: () => GetAllCategories(),
  });

  const categories = React.useMemo(() => {
    return data?.data ?? [];
  }, [data?.data]);

  function handleDownload(e: React.MouseEvent) {
    e.stopPropagation();
    window.electron?.ipcRenderer?.invoke("download-pdf", {
      pdfPath: pdf_path,
      title: title ? `${title}.pdf` : "paper.pdf",
    });
  }

  const { mutateAsync: updatePaperCategory } = useMutation({
    mutationFn: UpdatePaperMutation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKey.papers] });
      queryClient.invalidateQueries({ queryKey: [queryKey.categories] });
      queryClient.invalidateQueries({ queryKey: [queryKey.category] });
    },
  });

  const { mutateAsync: deletePaper } = useMutation({
    mutationFn: DeletePaperMutation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKey.papers] });
      queryClient.invalidateQueries({ queryKey: [queryKey.categories] });
      queryClient.invalidateQueries({ queryKey: [queryKey.category] });
    },
  });

  async function handleChangePaperCategory(categoryId: string) {
    toast.promise(
      updatePaperCategory({
        data: { category_id: categoryId, id: id },
      }),
      {
        loading: "Updating paper category",
        success: "Paper category created successfully",
        error: (err) => {
          return `Error: ${err.message}`;
        },
      }
    );
  }

  async function handleSoftDeletePaper() {
    toast.promise(
      updatePaperCategory({
        data: { is_deleted: true, id: id },
      }),
      {
        loading: "Moving paper to trash",
        success: "Paper moved to trash successfully",
        error: (err) => {
          return `Error: ${err.message}`;
        },
      }
    );
  }

  async function handleRestorePaper() {
    toast.promise(
      updatePaperCategory({
        data: { is_deleted: false, id: id },
      }),
      {
        loading: "Restoring paper from trash",
        success: "Paper restored from trash successfully",
        error: (err) => {
          return `Error: ${err.message}`;
        },
      }
    );
  }
  async function handleDeletePaper() {
    toast.promise(deletePaper({ id }), {
      loading: "Deleting paper",
      success: "Paper deleted successfully",
      error: (err) => {
        return `Error: ${err.message}`;
      },
    });
  }

  function handleOpenDetails() {
    setIsDialogOpen(true);
  }
  return (
    <>
      <ContextMenu>
        <ContextMenuTrigger className=" h-80  w-full hover:shadow-md transition-shadow ">
          <Card className="w-full h-full">
            <CardHeader className="pb-2">
              <div className="flex justify-between">
                <div className="flex items-center mb-2 gap-2 flex-wrap">
                  <div className="text-sm font-medium border-2 p-1 rounded-sm">
                    {moment(year).format("YYYY")}
                  </div>
                  <div
                    className="rounded-full px-2 py-1 text-base whitespace-nowrap overflow-hidden text-ellipsis max-w-[150px]"
                    // style={{ color: bgColor }}
                  >
                    {category}
                  </div>
                </div>
              </div>
              <CardTitle className="line-clamp-2 h-[3.2rem]">
                <h3 className="text-lg font-medium">{title}</h3>
              </CardTitle>
              <CardDescription className="line-clamp-1 max-h-6 overflow-hidden">
                <span>{author?.join(", ")}</span>
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-2">
              {/* Additional content could be added here */}
            </CardContent>
          </Card>
        </ContextMenuTrigger>
        <ContextMenuContent className="w-56">
          <ContextMenuLabel>Paper Actions</ContextMenuLabel>
          <ContextMenuSeparator />
          <ContextMenuItem
            onClick={() =>
              nav({
                to:"/pdf/$id",
                params: { id: id },
                search: {
                  title:paperDetailsData?.data?.title ?? "",
                  category:paperDetailsData?.data?.category?.name ?? "",
                }, 
              })
            }
          >
            <BookOpen className="mr-2 h-4 w-4" />
            <span>Open paper</span>
          </ContextMenuItem>
          <ContextMenuItem onClick={handleDownload}>
            <Download className="mr-2 h-4 w-4" />
            <span>Download PDF</span>
          </ContextMenuItem>
          <ContextMenuSub>
            <ContextMenuSubTrigger>
              <SwapIcon className="mr-2 h-4 w-4" /> Change Category
            </ContextMenuSubTrigger>
            <ContextMenuSubContent className="w-48">
              {categories?.map((category) => (
                <ContextMenuItem
                  key={category.id}
                  onClick={() => {
                    handleChangePaperCategory(category.id);
                  }}
                >
                  <span
                    className="w-3 h-3 rounded-full inline-block mr-2"
                    style={{ backgroundColor: category.color }}
                  ></span>

                  {category.name}
                </ContextMenuItem>
              ))}
            </ContextMenuSubContent>
          </ContextMenuSub>
          <ContextMenuSeparator />{" "}
          <ContextMenuItem onClick={handleOpenDetails}>
            <Info className="mr-2 h-4 w-4" />
            <span>Paper Details</span>
          </ContextMenuItem>
          {is_deleted ? (
            <ContextMenuItem onClick={handleRestorePaper}>
              <RefreshCcw className="mr-2 h-4 w-4" />
              <span>Restore</span>
            </ContextMenuItem>
          ) : (
            <ContextMenuItem onClick={handleSoftDeletePaper}>
              <TrashIcon className="mr-2 h-4 w-4" />
              <span>Move to trash</span>
            </ContextMenuItem>
          )}
          {!is_deleted && (
            <ContextMenuItem onClick={handleDeletePaper}>
              <SkullIcon className="mr-2 h-4 w-4 text-red-400" />
              <span className="text-red-400">Delete Paper</span>
            </ContextMenuItem>
          )}
        </ContextMenuContent>
      </ContextMenu>{" "}
      <PaperDetailsDialog
        open={isDialogOpen}
        setOpen={setIsDialogOpen}
        paper={paperDetailsData?.data}
      />
    </>
  );
}
