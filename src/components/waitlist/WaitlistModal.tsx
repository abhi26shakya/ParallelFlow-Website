"use client";

import { X } from "lucide-react";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useId,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { WaitlistForm } from "./WaitlistForm";

// Old links to the removed home page section open the modal instead.
const WAITLIST_HASH = "#waitlist";

// The footer's inline form passes the email it collected so the modal
// starts with it filled in.
type OpenWaitlist = (options?: { email?: string }) => void;

const OpenWaitlistContext = createContext<OpenWaitlist | null>(null);

export function useWaitlistModal() {
  const open = useContext(OpenWaitlistContext);
  if (!open) {
    throw new Error("useWaitlistModal must be used inside WaitlistModalProvider");
  }
  return open;
}

// One shared waitlist modal for the whole site. Every Join Waitlist button
// calls open() from this context. The native <dialog> opened with showModal()
// makes the rest of the page inert, so focus stays inside it, and closes on
// Escape by itself.
export function WaitlistModalProvider({ children }: { children: ReactNode }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const triggerRef = useRef<HTMLElement | null>(null);
  const pressedBackdrop = useRef(false);
  const [isOpen, setIsOpen] = useState(false);
  // Bumped on every open so the form starts fresh each time.
  const [formKey, setFormKey] = useState(0);
  const [initialEmail, setInitialEmail] = useState("");
  const titleId = useId();
  const descriptionId = useId();

  const open = useCallback<OpenWaitlist>((options) => {
    if (dialogRef.current?.open) return;
    triggerRef.current =
      document.activeElement instanceof HTMLElement ? document.activeElement : null;
    setFormKey((k) => k + 1);
    setInitialEmail(options?.email ?? "");
    setIsOpen(true);
  }, []);

  const close = () => dialogRef.current?.close();

  useEffect(() => {
    if (window.location.hash !== WAITLIST_HASH) return;
    const { pathname, search } = window.location;
    window.history.replaceState(null, "", pathname + search);
    open();
  }, [open]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!isOpen || !dialog) return;

    dialog.showModal();
    dialog.querySelector<HTMLElement>("[data-autofocus]")?.focus();

    // Lock page scroll. Padding stands in for the hidden scrollbar so the
    // page behind doesn't shift sideways.
    const root = document.documentElement;
    const scrollbar = window.innerWidth - root.clientWidth;
    const previous = { overflow: root.style.overflow, paddingRight: root.style.paddingRight };
    root.style.overflow = "hidden";
    if (scrollbar > 0) root.style.paddingRight = `${scrollbar}px`;

    return () => {
      root.style.overflow = previous.overflow;
      root.style.paddingRight = previous.paddingRight;
    };
  }, [isOpen]);

  // Fires for every way of closing: the x button, a backdrop click, Escape.
  function onClose() {
    setIsOpen(false);
    const trigger = triggerRef.current;
    triggerRef.current = null;
    if (trigger?.isConnected) trigger.focus();
  }

  return (
    <OpenWaitlistContext.Provider value={open}>
      {children}
      <dialog
        ref={dialogRef}
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
        onClose={onClose}
        // Close only when the press both starts and ends outside the card, so
        // selecting text in a field and releasing outside doesn't close it.
        onPointerDown={(e) => {
          pressedBackdrop.current = e.target === e.currentTarget;
        }}
        onClick={(e) => {
          if (pressedBackdrop.current && e.target === e.currentTarget) close();
          pressedBackdrop.current = false;
        }}
        className="m-0 size-full max-h-none max-w-none items-center justify-center border-0 bg-scrim p-4 text-foreground backdrop:bg-transparent open:flex motion-safe:transition-opacity motion-safe:duration-200 motion-safe:ease-out motion-safe:starting:open:opacity-0"
      >
        <div className="relative flex max-h-full w-full max-w-lg flex-col overflow-hidden rounded-card border border-line bg-card shadow-2xl shadow-black/60 light:shadow-black/15 motion-safe:transition-[opacity,scale] motion-safe:duration-200 motion-safe:ease-out motion-safe:starting:scale-95 motion-safe:starting:opacity-0">
          <button
            type="button"
            aria-label="Close"
            onClick={close}
            className="absolute right-3 top-3 z-10 inline-flex size-9 items-center justify-center rounded-control text-muted transition-colors hover:bg-hover hover:text-foreground"
          >
            <X aria-hidden="true" className="size-5" />
          </button>
          <div className="overflow-y-auto p-6 sm:p-8">
            <h2 id={titleId} className="pr-10 text-2xl font-bold tracking-tight">
              Join the Waitlist
            </h2>
            <p id={descriptionId} className="mb-6 mt-2 text-sm text-muted">
              Get early access to ParallelFlow and help shape the future of team
              collaboration.
            </p>
            {isOpen && <WaitlistForm key={formKey} initialEmail={initialEmail} />}
          </div>
        </div>
      </dialog>
    </OpenWaitlistContext.Provider>
  );
}
