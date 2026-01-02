import Index from "@/pages/home/ui/Page";
import { Toaster as Sonner } from "@/shared/ui/sonner";
import { Toaster } from "@/shared/ui/toaster";
import { TooltipProvider } from "@/shared/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";


const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Index />
      <Sonner />
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
