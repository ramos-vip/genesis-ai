"use client";

import {
  ComponentType,
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useState,
} from "react";

/* ─── Types ──────────────────────────────────────────────────────────────── */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyProps = Record<string, any>;

interface ModalEntry {
  id:        string;
  component: ComponentType<{ onClose: () => void } & AnyProps>;
  props?:    AnyProps;
}

interface ModalContextValue {
  /**
   * Open any component as a modal.
   * The component receives `onClose` as a prop automatically.
   * Returns the generated modal id.
   */
  openModal: <P extends AnyProps>(
    component: ComponentType<{ onClose: () => void } & P>,
    props?: P
  ) => string;
  closeModal:  (id: string) => void;
  closeAll:    () => void;
  /** Number of open modals */
  count: number;
}

/* ─── Context ────────────────────────────────────────────────────────────── */

const ModalContext = createContext<ModalContextValue | null>(null);

export function useModal(): ModalContextValue {
  const ctx = useContext(ModalContext);
  if (!ctx) throw new Error("useModal must be used inside <ModalProvider>");
  return ctx;
}

/* ─── Provider ───────────────────────────────────────────────────────────── */

let idCounter = 0;

export default function ModalProvider({ children }: { children: ReactNode }) {
  const [modals, setModals] = useState<ModalEntry[]>([]);

  const openModal = useCallback(<P extends AnyProps>(
    component: ComponentType<{ onClose: () => void } & P>,
    props?: P
  ): string => {
    const id = `modal-${++idCounter}`;
    const entry: ModalEntry = { id, component: component as ModalEntry["component"], props };
    setModals((prev) => [...prev, entry]);
    return id;
  }, []);

  const closeModal = useCallback((id: string) => {
    setModals((prev) => prev.filter((m) => m.id !== id));
  }, []);

  const closeAll = useCallback(() => {
    setModals([]);
  }, []);

  return (
    <ModalContext.Provider value={{ openModal, closeModal, closeAll, count: modals.length }}>
      {children}

      {/* Render all open modals */}
      {modals.map(({ id, component: Component, props }) => (
        <Component
          key={id}
          onClose={() => closeModal(id)}
          {...props}
        />
      ))}
    </ModalContext.Provider>
  );
}
