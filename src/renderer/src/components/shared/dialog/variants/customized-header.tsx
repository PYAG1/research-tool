import { WarningOctagonIcon, XIcon } from "@phosphor-icons/react";

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
import { Button, buttonVariants } from "@renderer/components/ui/button";

export default function CustomizedHeaderConfirmationModal({
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
    <div className="mx-auto sm:mx-0 mb-4 flex size-9 items-center justify-center rounded-full bg-destructive/10">
      <WarningOctagonIcon className="size-5 text-destructive" />
    </div>
  ),
  headerTitle = "Delete Account",
  onCancel,
  onConfirm,
}: Readonly<Omit<ConfirmationModalProps, "variant" | "footerTitle">>) {
  return (
    <AlertDialog open={show} onOpenChange={setShow}>
      <AlertDialogContent>
        <div className="-mt-3 -mx-6 border-b pb-3 px-6 flex justify-between items-center">
          <AlertDialogTitle>{headerTitle}</AlertDialogTitle>
          <AlertDialogCancel
            className={buttonVariants({
              variant: "ghost",
              size: "icon",
              className: "!size-7",
            })}
          >
            <XIcon />
          </AlertDialogCancel>
        </div>
        <AlertDialogHeader className="pt-2">
          <AlertDialogTitle>
            {icon}
            {title}
          </AlertDialogTitle>
          <AlertDialogDescription className="text-[15px]">
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="mt-2">
          <AlertDialogCancel onClick={onCancel}>Cancel</AlertDialogCancel>
          {showActionButton && (
            <Button
              onClick={onConfirm}
              isLoading={isLoading}
              className={btnClassName}
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
