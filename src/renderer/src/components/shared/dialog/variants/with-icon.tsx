import { ConfirmationModalProps } from "renderer/types";
import { WarningOctagonIcon } from "@phosphor-icons/react";

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

export default function WithIconConfirmationModal({
  show,
  setShow,
  btnClassName,
  btnTitle = "Continue",
  description = "This action cannot be undone. This will permanently delete your account and remove your data from our servers.",
  isLoading,
  showActionButton = true,
  title = "Are you absolutely sure?",
  btnVariant = "destructive",
  icon = (
    <div className="mx-auto sm:mx-0 mb-4 flex size-14 items-center justify-center rounded-full bg-red-500/10">
      <WarningOctagon className="size-7 text-red-500" />
    </div>
  ),
  onCancel,
  onConfirm,
}: Readonly<
  Omit<ConfirmationModalProps, "variant" | "footerTitle" | "headerTitle">
>) {
  return (
    <AlertDialog open={show} onOpenChange={setShow}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {icon}
            {title}
          </AlertDialogTitle>
          <AlertDialogDescription className="text-[15px]">
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onCancel}>Cancel</AlertDialogCancel>
          {showActionButton && (
            <Button
              isLoading={isLoading}
              className={btnClassName}
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
