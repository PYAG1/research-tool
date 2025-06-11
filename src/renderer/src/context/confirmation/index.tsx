import { omit } from "lodash";
import { createContext, PropsWithChildren, useContext, useState } from "react";

import { ConfirmationContextProps, ConfirmationProps } from "@renderer/types";
import { ConfirmationDialog } from "@renderer/components/shared/dialog";

export const ConfirmationProviderContext = createContext<
  ConfirmationContextProps | undefined
>(undefined);

export function useConfirmation() {
  const context = useContext(ConfirmationProviderContext);

  if (!context) {
    throw new Error(
      "useConfirmation must be used within a ConfirmationProvider"
    );
  }

  return context;
}

/**
 * Provides a context for managing confirmation modals.
 *
 * @param children - The child components to render within the provider.
 */
export default function ConfirmationProvider({ children }: PropsWithChildren) {
  const [open, onOpenChange] = useState<boolean>(false);
  const [modalProps, setModalProps] = useState<ConfirmationProps>({
    onConfirm: () => true,
  });

  /**
   * Shows a confirmation modal.
   *
   * @param state - The state of the modal (true for open, false for closed).
   * @param options - Optional props to customize the modal.
   */
  function showConfirmation(options?: ConfirmationProps) {
    if (options) {
      setModalProps(options);
    }
    onOpenChange(!open);
  }

  return (
    <ConfirmationProviderContext.Provider value={{ showConfirmation }}>
      <ConfirmationDialog
        show={open}
        setShow={onOpenChange}
        onConfirm={() => {
          const res = modalProps.onConfirm();
          const confirmationResponse = res;
          onOpenChange(!confirmationResponse);

          return confirmationResponse;
        }}
        {...omit(modalProps, "onConfirm")}
      />
      {children}
    </ConfirmationProviderContext.Provider>
  );
}
