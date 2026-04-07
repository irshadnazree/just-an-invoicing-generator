import { Toast } from "@base-ui/react/toast";
import type { ReactNode } from "react";

import { ToastViewport } from "@/components/ui/Toast";

export type AppToastProviderProps = {
  children: ReactNode;
};

export function AppToastProvider({ children }: AppToastProviderProps) {
  return (
    <Toast.Provider>
      {children}
      <ToastViewport />
    </Toast.Provider>
  );
}

// Re-export useToastManager from the Toast namespace
export const useToastManager = Toast.useToastManager;
