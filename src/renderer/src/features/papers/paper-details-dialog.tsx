import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@renderer/components/ui/dialog";
import moment from "moment";


import { ModalProps, ResearchPapers } from "@renderer/types";

interface PaperDetailsDialogProps extends ModalProps {
  paper?: ResearchPapers & {
    category?: {
      name: string;
    } | null;
  };
}

export default function PaperDetailsDialog({
  open = false,
  setOpen,
  paper,
}: PaperDetailsDialogProps) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-left">Paper Details</DialogTitle>
          <DialogDescription className="text-left">
            Detailed information about this research paper
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-6 py-4">
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-medium text-gray-600 mb-2">Title</h4>
              <p className="text-base font-medium leading-relaxed">
                {paper?.title ?? "NA"}
              </p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-600 mb-2">
                Authors
              </h4>
              <p className="text-sm">
                {paper?.authors?.length ? paper.authors.join(", ") : "NA"}
              </p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-600 mb-2">
                Abstract
              </h4>
              <p className="text-sm text-gray-700 leading-relaxed">
                {paper?.abstract ?? "NA"}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-medium text-gray-600 mb-2">Year</h4>
                <p className="text-sm">
                  {paper?.created_at
                    ? moment(paper.created_at).format("YYYY")
                    : "NA"}
                </p>
              </div>{" "}
              <div>
                <h4 className="text-sm font-medium text-gray-600 mb-2">
                  Category
                </h4>
                <p className="text-sm">{paper?.category?.name ?? "NA"}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-medium text-gray-600 mb-2">DOI</h4>
                <p className="text-sm">{paper?.doi ?? "NA"}</p>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-600 mb-2">
                  Publication
                </h4>
                <p className="text-sm">{paper?.publication ?? "NA"}</p>
              </div>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-600 mb-2">
                Keywords
              </h4>
              <p className="text-sm">
                {paper?.keywords?.length ? paper.keywords.join(", ") : "NA"}
              </p>
            </div>{" "}
            <div>
              <h4 className="text-sm font-medium text-gray-600 mb-2">
                File Path
              </h4>
              <p className="text-xs text-neutral-600 break-all">
                {paper?.pdf_path ?? "NA"}
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
