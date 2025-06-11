import { ConfirmationModalProps } from "renderer/types";

import InfoConfirmationModal from "./variants/info";
import DefaultConfirmationModal from "./variants/default";
import WithIconConfirmationModal from "./variants/with-icon";
import WithInputConfirmationModal from "./variants/with-input";
import DestructiveConfirmationModal from "./variants/destructive";
import WithChildrenConfirmationModal from "./variants/with-children";
import CustomizedHeaderConfirmationModal from "./variants/customized-header";
import CustomizedFooterConfirmationModal from "./variants/customized-footer";

/**
 *  Confirmation dialog
 * @param show - boolean to show or hide the dialog
 * @param setShow - function to set the show state
 * @param title - title of the dialog
 * @param description - description of the dialog
 * @param onConfirm - function to run when the confirm button is clicked
 * @param onCancel - function to run when the cancel button is clicked
 * @param isLoading - boolean to show loading state
 * @param btnTitle - title of the confirm button
 * @param btnClassName - class name of the confirm button
 * @param btnVariant - variant of the confirm button
 * @param showActionButton - boolean to show action button or not
 *
 *
 *  By default, the confirm button is styled with the `destructive` variant
 *  so it is treated as a destructive/delete action.
 *
 * @returns
 * @example
 *
 * const { showConfirmation } = useConfirmationContext() // global context
 *
 * function onSubmit() {
 *  showConfirmation({
 *    title: "Foo",
 *    description: "bar",
 *    onConfirm: () => {
 *      // do something
 *      return true // this will close the dialog
 *    },
 *  ...
 * })
 * }
 */

export function ConfirmationDialog({
  variant = "default",
  ...props
}: Readonly<ConfirmationModalProps>) {
  switch (variant) {
    case "with-icon":
      return <WithIconConfirmationModal {...props} />;
    case "with-input":
      return <WithInputConfirmationModal {...props} />;
    case "with-children":
      return <WithChildrenConfirmationModal {...props} />;
    case "destructive":
      return <DestructiveConfirmationModal {...props} />;
    case "info":
      return <InfoConfirmationModal {...props} />;
    case "customized-header":
      return <CustomizedHeaderConfirmationModal {...props} />;
    case "customized-footer":
      return <CustomizedFooterConfirmationModal {...props} />;
    default:
      return <DefaultConfirmationModal {...props} />;
  }
}
