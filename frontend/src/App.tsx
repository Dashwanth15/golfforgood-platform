import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';

// Layouts
import { PublicLayout, DashboardLayout } from './components/layout/Layouts';

// Route Guards
import { ProtectedRoute, AdminRoute, PublicOnlyRoute } from './components/shared/ProtectedRoute';

// Public Pages
import Landing from './pages/public/Landing';
import Login from './pages/public/Login';
import Register from './pages/public/Register';
import Subscribe from './pages/public/Subscribe';
import Charities from './pages/public/Charities';
import AuthCallback from './pages/public/AuthCallback';

import { lazy, Suspense } from 'react';
import { Loader2 } from 'lucide-react';

// Dashboard Pages
const DashboardOverview = lazy(() => import('./pages/dashboard/Overview'));
const Scores = lazy(() => import('./pages/dashboard/Scores'));
const MyCharity = lazy(() => import('./pages/dashboard/MyCharity'));
const Draws = lazy(() => import('./pages/dashboard/Draws'));
const Winnings = lazy(() => import('./pages/dashboard/Winnings'));
const Donations = lazy(() => import('./pages/dashboard/Donations'));
const Profile = lazy(() => import('./pages/dashboard/Profile'));

// Admin Pages
const AdminOverview = lazy(() => import('./pages/admin/AdminOverview'));
const AdminUsers = lazy(() => import('./pages/admin/AdminUsers'));
const AdminCharities = lazy(() => import('./pages/admin/AdminCharities'));
const AdminDraws = lazy(() => import('./pages/admin/AdminDraws'));
const AdminWinners = lazy(() => import('./pages/admin/AdminWinners'));
const AdminSubscriptions = lazy(() => import('./pages/admin/AdminSubscriptions'));

const PageLoader = () => (
  <div className="flex items-center justify-center min-h-[400px] w-full">
    <Loader2 className="w-8 h-8 animate-spin text-brand" />
  </div>
);


const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60,      // 1 min
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Suspense fallback={<PageLoader />}>
          <Routes>

            {/* ── PUBLIC ROUTES ─────────────────────────────────── */}
            <Route element={<PublicLayout />}>
              <Route path="/" element={<Landing />} />
              <Route path="/charities" element={<Charities />} />

              {/* Public-only (redirect if logged in) */}
              <Route element={<PublicOnlyRoute />}>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
              </Route>

              <Route path="/auth/callback" element={<AuthCallback />} />

              {/* Requires auth */}
              <Route element={<ProtectedRoute />}>
                <Route path="/subscribe" element={<Subscribe />} />
              </Route>
            </Route>

            {/* ── SUBSCRIBER DASHBOARD ──────────────────────────── */}
            <Route element={<ProtectedRoute />}>
              <Route element={<DashboardLayout />}>
                <Route path="/dashboard" element={<DashboardOverview />} />
                <Route path="/dashboard/scores" element={<Scores />} />
                <Route path="/dashboard/charity" element={<MyCharity />} />
                <Route path="/dashboard/donations" element={<Donations />} />
                <Route path="/dashboard/draws" element={<Draws />} />
                <Route path="/dashboard/winnings" element={<Winnings />} />
                <Route path="/dashboard/profile" element={<Profile />} />
              </Route>
            </Route>

            {/* ── ADMIN DASHBOARD ───────────────────────────────── */}
            <Route element={<AdminRoute />}>
              <Route element={<DashboardLayout />}>
                <Route path="/admin" element={<AdminOverview />} />
                <Route path="/admin/users" element={<AdminUsers />} />
                <Route path="/admin/charities" element={<AdminCharities />} />
                <Route path="/admin/draws" element={<AdminDraws />} />
                <Route path="/admin/winners" element={<AdminWinners />} />
                <Route path="/admin/subscriptions" element={<AdminSubscriptions />} />
              </Route>
            </Route>

            {/* ── FALLBACK ──────────────────────────────────────── */}
            <Route path="*" element={<Navigate to="/" replace />} />

          </Routes>
        </Suspense>
      </BrowserRouter>

      {/* Toast Notifications */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#fff',
            color: '#0F172A',
            borderRadius: '12px',
            border: '1px solid #E2E8F0',
            boxShadow: '0 4px 16px 0 rgba(0,0,0,0.08)',
            fontSize: '14px',
            fontWeight: '500',
          },
          success: { iconTheme: { primary: '#22C55E', secondary: '#fff' } },
          error:   { iconTheme: { primary: '#EF4444', secondary: '#fff' } },
        }}
      />
    </QueryClientProvider>
  );
}
