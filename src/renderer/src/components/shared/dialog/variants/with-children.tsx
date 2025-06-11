import { ConfirmationModalProps } from "renderer/types";

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "renderer/components/ui/alert-dialog";
import { Button } from "renderer/components/ui/button";
import { cn } from "renderer/lib";

export default function WithChildrenConfirmationModal({
  show,
  setShow,
  btnClassName,
  btnTitle = "Continue",
  description = "This action cannot be undone. This will permanently delete your account and remove your data from our servers.",
  isLoading,
  showActionButton = true,
  title = "Are you absolutely sure?",
  btnVariant = "destructive",
  onCancel,
  onConfirm,
  children,
}: Readonly<Omit<ConfirmationModalProps, "variant">>) {
  return (
    <AlertDialog open={show} onOpenChange={setShow}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>

        <div className="">{children}</div>

        <AlertDialogFooter>
          <AlertDialogCancel onClick={onCancel}>Close</AlertDialogCancel>
          {showActionButton && (
            <Button
              isLoading={isLoading}
              className={cn(btnClassName)}
              onClick={onConfirm}
              variant={btnVariant}
            >
              {btnTitle}
            </Button>
          )}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
