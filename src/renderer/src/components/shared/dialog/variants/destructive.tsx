import { WarningOctagonIcon } from "@phosphor-icons/react";

import { ConfirmationModalProps } from "@renderer/types";

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@renderer/components/ui/alert-dialog";
import { Button } from "@renderer/components/ui/button";

export default function DestructiveConfirmationModal({
  show,
  setShow,
  btnClassName,
  btnTitle = "Continue",
  description = "This action cannot be undone. This will permanently delete your account and remove your data from our servers.",
  isLoading,
  showActionButton = true,
  title = "Are you absolutely sure?",
  icon = (
    <div className="mx-auto sm:mx-0 mb-4 flex size-14 items-center justify-center rounded-full bg-red-500/10">
      <WarningOctagonIcon className="size-7 text-red-500" />
    </div>
  ),
  onCancel,
  onConfirm,
}: Readonly<
  Omit<
    ConfirmationModalProps,
    "variant" | "btnVariant" | "footerTitle" | "headerTitle"
  >
>) {
  return (
    <AlertDialog open={show} onOpenChange={setShow}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex flex-col items-center">
            {icon}
            {title}
          </AlertDialogTitle>
          <AlertDialogDescription className="text-[15px] text-center">
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="mt-2 sm:justify-center">
          <AlertDialogCancel onClick={onCancel}>Cancel</AlertDialogCancel>
          {showActionButton && (
            <Button
              variant="destructive"
              onClick={onConfirm}
              isLoading={isLoading}
              className={btnClassName}
            >
              {btnTitle}
            </Button>
          )}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
