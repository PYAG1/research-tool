import { ThemeProvider } from "@renderer/context";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode } from '@tanstack/react-router';

import { Toaster } from "sonner";
const queryClient = new QueryClient();
export default function Providers({ children }: {children: ReactNode}) {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light" storageKey="electron-ui-theme">
       
     
            <Toaster richColors expand />
            {children}
       
      </ThemeProvider>
    </QueryClientProvider>
  )
}
