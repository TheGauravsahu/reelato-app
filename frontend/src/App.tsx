import AppRoutes from "./routes/AppRoutes";
import { ThemeProvider } from "@/components/general/theme-provider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect } from "react";

function App() {
  const queryClient = new QueryClient();

  useEffect(() => {
    // 🔒 Disable right click
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
    };

    document.addEventListener("contextmenu", handleContextMenu);
    return () => {
      document.removeEventListener("contextmenu", handleContextMenu);
    };
  }, []);

  return (
    <ThemeProvider defaultTheme="dark" storageKey="reelato-ui-theme">
      <QueryClientProvider client={queryClient}>
        <AppRoutes />
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
