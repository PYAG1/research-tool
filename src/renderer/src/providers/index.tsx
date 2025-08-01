import { ThemeProvider } from '@renderer/context'
import { AuthProvider } from '@renderer/context/auth'
import ConfirmationProvider from '@renderer/context/confirmation'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactNode } from '@tanstack/react-router'

import { Toaster } from 'sonner'
const queryClient = new QueryClient()
export default function Providers({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light" storageKey="electron-ui-theme">
        <ConfirmationProvider>
        <AuthProvider>
          <Toaster richColors expand />
          {children}
        </AuthProvider>
        </ConfirmationProvider>
      </ThemeProvider>
    </QueryClientProvider>
  )
}
