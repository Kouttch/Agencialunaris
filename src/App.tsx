import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { ThemeProvider } from "@/components/theme-provider";
import { DashboardLayout } from "@/layouts/DashboardLayout";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import CustomerDashboard from "./pages/CustomerDashboard";
import CustomerProfile from "./pages/CustomerProfile";
import CustomerRecharge from "./pages/CustomerRecharge";
import AdminDashboard from "./pages/AdminDashboard";
import ClientsManagement from "./pages/ClientsManagement";
import DashboardsManagement from "./pages/DashboardsManagement";
import PaymentsManagement from "./pages/PaymentsManagement";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/auth" element={<Auth />} />
              <Route path="/" element={<Index />} />
              
              {/* Customer Dashboard Routes */}
              <Route 
                path="/minha-conta" 
                element={
                  <ProtectedRoute>
                    <DashboardLayout>
                      <CustomerDashboard />
                    </DashboardLayout>
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/minha-conta/profile" 
                element={
                  <ProtectedRoute>
                    <DashboardLayout>
                      <CustomerProfile />
                    </DashboardLayout>
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/minha-conta/recargas" 
                element={
                  <ProtectedRoute>
                    <DashboardLayout>
                      <CustomerRecharge />
                    </DashboardLayout>
                  </ProtectedRoute>
                } 
              />
              
              {/* Admin Dashboard Routes */}
              <Route 
                path="/fulladmin" 
                element={
                  <ProtectedRoute>
                    <DashboardLayout>
                      <AdminDashboard />
                    </DashboardLayout>
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/fulladmin/clients" 
                element={
                  <ProtectedRoute>
                    <DashboardLayout>
                      <ClientsManagement />
                    </DashboardLayout>
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/fulladmin/dashboards" 
                element={
                  <ProtectedRoute>
                    <DashboardLayout>
                      <DashboardsManagement />
                    </DashboardLayout>
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/fulladmin/payments" 
                element={
                  <ProtectedRoute>
                    <DashboardLayout>
                      <PaymentsManagement />
                    </DashboardLayout>
                  </ProtectedRoute>
                } 
              />
              
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
