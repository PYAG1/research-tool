import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@renderer/components/ui/dialog";

import FileUpload from "@renderer/components/shared/file";
import { ModalProps } from "@renderer/types";

interface AddDocumentModalProps extends ModalProps {
  category_id?: string;
}
export default function AddDocumentModal({
  open,
  setOpen,
  category_id,
}: Readonly<AddDocumentModalProps>) {
  const handleUploadComplete = () => {
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create a new document</DialogTitle>
          <DialogDescription>
            Upload PDF documents or research papers to your library. Organize
            your academic resources and references in one convenient location.
          </DialogDescription>
        </DialogHeader>
        <FileUpload
          category_id={category_id}
          onUploadComplete={handleUploadComplete}
        />
      </DialogContent>
    </Dialog>
  );
}
