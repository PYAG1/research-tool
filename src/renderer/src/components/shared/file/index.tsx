
import { useAuth } from "@renderer/context/auth";
import Dropzone, {
  DropzoneEmptyState,
  DropzoneContent
} from "react-dropzone";
import { useSupabaseUpload } from "@renderer/hooks/use-supabase-upload";

export default function FileUpload({
  onUploadComplete,
  category_id,
}: {
  onUploadComplete?: () => void;
  category_id?: string;
}) {
  const { session } = useAuth();
  const props = useSupabaseUpload({
    bucketName: "test",
    path: session?.user.id ?? "default",
    allowedMimeTypes: ["application/pdf"],
    maxFiles: 1,
    maxFileSize: 1000 * 1000 * 10, // 10MB,
    onUploadComplete,
    category_id: category_id,
  });

  return (
    <div className="w-full">
      <Dropzone {...props}>
        <DropzoneEmptyState />
        <DropzoneContent />
      </Dropzone>
    </div>
  );
}
