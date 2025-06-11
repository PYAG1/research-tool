import { PropsWithChildren } from "react";


import { ButtonProps } from "@renderer/components/ui/button";

export type ConfirmationVariants =
  | "default"
  | "with-icon"
  | "with-input"
  | "with-children"
  | "destructive"
  | "info"
  | "customized-header"
  | "customized-footer";

export interface ConfirmationModalProps extends PropsWithChildren {
  /**
   * The title of the confirmation modal.
   */
  title?: string;

  /**
   * The title of the header of the confirmation modal.
   */
  headerTitle?: string;

  /**
   * The title of the footer of the confirmation modal.
   */
  footerTitle?: string;

  /**
   * The description of the confirmation modal.
   */
  description?: string;

  /**
   * The variant of the confirmation modal.
   */
  variant?: ConfirmationVariants;

  /**
   * The callback function to be called when the confirm button is clicked.
   * Should return a boolean value indicating whether the confirmation was successful.
   *
   * returning `true` automatically closes the dialog
   */
  onConfirm: () => boolean;

  /**
   * The callback function to be called when the cancel button is clicked.
   */
  onCancel?: () => void;

  /**
   * Determines whether the confirmation modal is shown or hidden.
   */
  show: boolean;

  /**
   * Sets the value of the `show` prop.
   * Accepts a boolean value.
   */
  setShow: (value: boolean) => void;

  /**
   * Determines whether the confirmation modal is in a loading state.
   */
  isLoading?: boolean;

  /**
   * The title of the confirm button.
   */
  btnTitle?: string;

  /**
   * The CSS class name for the confirm button.
   */
  btnClassName?: string;

  /**
   * The variant of the button
   */
  btnVariant?: ButtonProps["variant"];

  /**
   * whether to show action button or not
   * default is `true`
   */
  showActionButton?: boolean;

  /**
   * Icon to show in the dialog
   */
  icon?: React.ReactNode;

  /**
   * The value to be confirmed
   */
  value?: string;
}

export type ConfirmationProps = Omit<
  ConfirmationModalProps,
  "setShow" | "show"
>;

export type ConfirmationContextProps = {
  /**
   * Shows a confirmation modal.
   *
   * @param options - Optional props to customize the modal.
   */
  showConfirmation: (options: ConfirmationProps) => void;
};

