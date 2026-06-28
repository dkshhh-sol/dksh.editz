import { createContext, useContext, useState, type ReactNode } from "react";

type CursorLabel = "" | "PLAY" | "PAUSE" | "MUTE" | "UNMUTE" | "FULLSCREEN" | "VIEW" | "OPEN" | "SCROLL" | "DRAG";

interface CursorState {
  label: CursorLabel;
  setLabel: (l: CursorLabel) => void;
}

const CursorCtx = createContext<CursorState>({ label: "", setLabel: () => {} });

export function CursorProvider({ children }: { children: ReactNode }) {
  const [label, setLabel] = useState<CursorLabel>("");
  return <CursorCtx.Provider value={{ label, setLabel }}>{children}</CursorCtx.Provider>;
}

export function useCursor() {
  return useContext(CursorCtx);
}

/** Spread on an element to set a cursor label on hover. */
export function cursorHover(label: CursorLabel) {
  return {
    onMouseEnter: () => {
      const ev = new CustomEvent("dksh:cursor", { detail: label });
      window.dispatchEvent(ev);
    },
    onMouseLeave: () => {
      const ev = new CustomEvent("dksh:cursor", { detail: "" });
      window.dispatchEvent(ev);
    },
  };
}