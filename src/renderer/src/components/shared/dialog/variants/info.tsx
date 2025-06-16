import { ArrowCircleUp, Rocket } from "@phosphor-icons/react";

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
import { Badge } from "@renderer/components/ui/badge";
import { Button } from "@renderer/components/ui/button";

export default function InfoConfirmationModal({
  show,
  setShow,
  btnClassName,
  btnTitle = "Update Now",
  description = "A new software update is available for your device. Please update to the latest version to continue using the app.",
  isLoading,
  showActionButton = true,
  title = " New Software Update Available",
  btnVariant = "destructive",
  onCancel,
  onConfirm,
}: Readonly<Omit<ConfirmationModalProps, "variant">>) {
  return (
    <AlertDialog open={show} onOpenChange={setShow}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <div className="mx-auto sm:mx-0 mb-4 flex h-9 w-9 items-center justify-center rounded-full bg-primary/10">
            <ArrowCircleUp className="h-[18px] w-[18px] text-primary" />
          </div>
          <AlertDialogTitle className="text-2xl font-bold tracking-tight">
            {title}
          </AlertDialogTitle>
          <AlertDialogDescription className="!mt-3 text-[15px]">
            {description}
          </AlertDialogDescription>
          <div className="!mt-6 flex flex-wrap gap-2">
            <Badge variant="outline" className="py-1">
              Faster Performance
            </Badge>
            <Badge variant="outline" className="py-1">
              Advanced Blocks
            </Badge>
            <Badge variant="outline" className="py-1">
              Customized Components
            </Badge>
            <Badge variant="outline" className="py-1">
              UI Revamp
            </Badge>
            <Badge variant="outline" className="py-1">
              Security Improvements
            </Badge>
            <Badge variant="outline" className="py-1">
              Other Improvements
            </Badge>
            <Badge variant="outline" className="py-1">
              Bug Fixes
            </Badge>
            <Badge variant="outline" className="py-1">
              + much more
            </Badge>
          </div>
        </AlertDialogHeader>
        <AlertDialogFooter className="mt-4">
          <AlertDialogCancel onClick={onCancel}>Cancel</AlertDialogCancel>
          {showActionButton && (
            <Button
              onClick={onConfirm}
              isLoading={isLoading}
              className={btnClassName}
              variant={btnVariant}
            >
              <Rocket />
              {btnTitle}
            </Button>
          )}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
