import { useMemo, useState } from "react";

import { WarningOctagonIcon } from "@phosphor-icons/react";

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
import { Input } from "renderer/components/ui/input";
import { Button } from "renderer/components/ui/button";
import { Separator } from "renderer/components/ui/separator";

export default function WithInputConfirmationModal({
  show,
  setShow,
  btnClassName,
  btnTitle = "Continue",
  description = "This action cannot be undone. This will permanently delete your account and remove your data from our servers.",
  isLoading,
  showActionButton = true,
  title = "Are you absolutely sure?",
  btnVariant = "destructive",
  value = "DELETE",
  icon = (
    <div className="mx-auto sm:mx-0 mb-4 flex size-14 items-center justify-center rounded-full bg-red-500/10">
      <WarningOctagonIcon className="size-7 text-red-500" />
    </div>
  ),
  onCancel,
  onConfirm,
}: Readonly<
  Omit<ConfirmationModalProps, "variant" | "footerTitle" | "headerTitle">
>) {
  const [confirmValue, setConfirmValue] = useState("");

  const isConfirmValueValid = useMemo(
    () => confirmValue === value,
    [confirmValue, value]
  );

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

        <Separator />

        <div className="space-y-2">
          <p className="text-sm font-normal text-muted-foreground">
            Type <em>{value}</em> to confirm delete
          </p>
          <Input
            placeholder={`Enter the ${value} to confirm`}
            value={confirmValue}
            onChange={(e) => setConfirmValue(e.target.value)}
          />
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel onClick={onCancel}>Cancel</AlertDialogCancel>
          {showActionButton && (
            <Button
              isLoading={isLoading}
              className={btnClassName}
              onClick={() => {
                setConfirmValue("");
                onConfirm?.();
              }}
              variant={btnVariant}
              disabled={!isConfirmValueValid}
            >
              {btnTitle}
            </Button>
          )}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
