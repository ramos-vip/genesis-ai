/**
 * Composed root providers.
 *
 * Order matters:
 * 1. QueryProvider   — data layer, must wrap everything
 * 2. ToastProvider   — can be triggered by any layer below
 * 3. ModalProvider   — renders modals, needs toast context
 * 4. CommandProvider — registers shortcuts, needs modal context
 */

import { ReactNode } from "react";
import QueryProvider   from "./QueryProvider";
import ToastProvider   from "./ToastProvider";
import ModalProvider   from "./ModalProvider";
import CommandProvider from "./CommandProvider";

interface ProvidersProps {
  children: ReactNode;
}

export default function Providers({ children }: ProvidersProps) {
  return (
    <QueryProvider>
      <ToastProvider>
        <ModalProvider>
          <CommandProvider>
            {children}
          </CommandProvider>
        </ModalProvider>
      </ToastProvider>
    </QueryProvider>
  );
}

export { useToast }   from "./ToastProvider";
export { useModal }   from "./ModalProvider";
export { useCommand } from "./CommandProvider";
export type { Toast, ToastType } from "./ToastProvider";
export type { CommandItem }      from "./CommandProvider";
