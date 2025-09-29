import AppRoutes from "./routes/AppRoutes";
import { ThemeProvider } from "@/components/general/theme-provider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useUserAuthStore } from "./hooks/useUserAuthStore";
import { useEffect } from "react";

function App() {
  const { checkAuth } = useUserAuthStore();
  const queryClient = new QueryClient();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <ThemeProvider defaultTheme="dark" storageKey="reelato-ui-theme">
      <QueryClientProvider client={queryClient}>
        <AppRoutes />
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
