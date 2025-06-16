import {
  LinkIcon,
  WarningOctagonIcon,
  TrashIcon,
  XIcon,
} from "@phosphor-icons/react";

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

export default function CustomizedFooterConfirmationModal({
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
    <div className="mx-auto sm:mx-0 mb-4 flex size-9 items-center justify-center rounded-full bg-red-500/10">
      <WarningOctagonIcon className="size-5 text-red-500" />
    </div>
  ),
  footerTitle = "Learn more",
  onCancel,
  onConfirm,
}: Readonly<Omit<ConfirmationModalProps, "variant" | "headerTitle">>) {
  return (
    <AlertDialog open={show} onOpenChange={setShow}>
      <AlertDialogContent className="overflow-hidden">
        <AlertDialogHeader className="pb-4">
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription className="text-[15px]">
            {icon}
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <Button></Button>
        <AlertDialogFooter className="border-t -mx-6 -mb-6 px-6 py-5">
          <Button
            variant="link"
            className="-ml-3 mr-auto text-muted-foreground"
          >
            {footerTitle} <LinkIcon />
          </Button>
          <AlertDialogCancel onClick={onCancel}>
            <XIcon /> Cancel
          </AlertDialogCancel>
          {showActionButton && (
            <Button
              variant={btnVariant}
              onClick={onConfirm}
              isLoading={isLoading}
              className={btnClassName}
            >
              <TrashIcon />
              {btnTitle}
            </Button>
          )}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
