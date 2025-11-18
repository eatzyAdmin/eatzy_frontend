import { create } from "@repo/store";

interface TransitionState {
  isTransitioning: boolean;
  fromRect: DOMRect | null;
  toPath: string | null;
  startTransition: (rect: DOMRect, path: string) => void;
  endTransition: () => void;
}

export const useTransitionStore = create<TransitionState>((set) => ({
  isTransitioning: false,
  fromRect: null,
  toPath: null,
  startTransition: (rect, path) => set({ isTransitioning: true, fromRect: rect, toPath: path }),
  endTransition: () => set({ isTransitioning: false, fromRect: null, toPath: null }),
}));