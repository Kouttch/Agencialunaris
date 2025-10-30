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
import CustomerStrategy from "./pages/CustomerStrategy";
import AdminDashboard from "./pages/AdminDashboardReal";
import ClientsManagement from "./pages/ClientsManagement";
import DashboardsManagement from "./pages/DashboardsManagement";
import PaymentsManagement from "./pages/PaymentsManagement";
import UsersManagement from "./pages/UsersManagement";
import DataManagement from "./pages/DataManagement";
import ChecklistManagement from "./pages/ChecklistManagement";
import NotFound from "./pages/NotFound";
import Contact from "./pages/Contact";
import TermsOfUse from "./pages/TermsOfUse";
import Privacy from "./pages/Privacy";
import StrategyManagement from "./pages/StrategyManagement";
import ClientDashboardView from "./pages/ClientDashboardView";
import CampaignNamesManagement from "./pages/CampaignNamesManagement";
import UserDashboardsManagement from "./pages/UserDashboardsManagement";

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
              <Route path="/contact" element={<Contact />} />
              <Route path="/terms-of-use" element={<TermsOfUse />} />
              <Route path="/privacy" element={<Privacy />} />
              
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
              <Route 
                path="/minha-conta/estrategia" 
                element={
                  <ProtectedRoute>
                    <DashboardLayout>
                      <CustomerStrategy />
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
                path="/fulladmin/payments"
                element={
                  <ProtectedRoute>
                    <DashboardLayout>
                      <PaymentsManagement />
                    </DashboardLayout>
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/fulladmin/users" 
                element={
                  <ProtectedRoute>
                    <DashboardLayout>
                      <UsersManagement />
                    </DashboardLayout>
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/fulladmin/data" 
                element={
                  <ProtectedRoute>
                    <DashboardLayout>
                      <DataManagement />
                    </DashboardLayout>
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/fulladmin/checklist" 
                element={
                  <ProtectedRoute>
                    <DashboardLayout>
                      <ChecklistManagement />
                    </DashboardLayout>
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/fulladmin/strategies" 
                element={
                  <ProtectedRoute>
                    <DashboardLayout>
                      <StrategyManagement />
                    </DashboardLayout>
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/fulladmin/dashboards" 
                element={
                  <ProtectedRoute>
                    <DashboardLayout>
                      <ClientDashboardView />
                    </DashboardLayout>
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/fulladmin/campaign-names" 
                element={
                  <ProtectedRoute>
                    <DashboardLayout>
                      <CampaignNamesManagement />
                    </DashboardLayout>
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/fulladmin/user-dashboards" 
                element={
                  <ProtectedRoute>
                    <DashboardLayout>
                      <UserDashboardsManagement />
                    </DashboardLayout>
                  </ProtectedRoute>
                } 
              />
              
              {/* Moderator Dashboard Routes */}
              <Route 
                path="/moderator/checklist"
                element={
                  <ProtectedRoute>
                    <DashboardLayout>
                      <ChecklistManagement />
                    </DashboardLayout>
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/moderator/payments" 
                element={
                  <ProtectedRoute>
                    <DashboardLayout>
                      <PaymentsManagement />
                    </DashboardLayout>
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/moderator/strategy" 
                element={
                  <ProtectedRoute>
                    <DashboardLayout>
                      <CustomerStrategy />
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
