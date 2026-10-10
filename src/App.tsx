import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { AdminGuard } from './components/admin/AdminGuard';
import { ClientGuard } from './components/ClientGuard';
import { AdminLayout } from './components/admin/AdminLayout';
import { PublicHome } from './pages/PublicHome';
import { AuthLogin } from './pages/AuthLogin';
import { SetupPage } from './pages/SetupPage';
import { ClientAccount } from './pages/ClientAccount';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminHeroEditor } from './pages/admin/AdminHeroEditor';
import { AdminGlobalEditor } from './pages/admin/AdminGlobalEditor';
import { AdminServicesEditor } from './pages/admin/AdminServicesEditor';
import { AdminProjectsEditor } from './pages/admin/AdminProjectsEditor';
import { AdminPricingEditor } from './pages/admin/AdminPricingEditor';
import { AdminAboutEditor } from './pages/admin/AdminAboutEditor';
import { AdminTestimonialsEditor } from './pages/admin/AdminTestimonialsEditor';
import { AdminBlogEditor } from './pages/admin/AdminBlogEditor';
import { AdminProcessEditor } from './pages/admin/AdminProcessEditor';
import { AdminTechEditor } from './pages/admin/AdminTechEditor';
import { AdminComparisonEditor } from './pages/admin/AdminComparisonEditor';
import { AdminLeadsInbox } from './pages/admin/AdminLeadsInbox';
import { AdminActivityLog } from './pages/admin/AdminActivityLog';
import { AdminUsers } from './pages/admin/AdminUsers';
import { loadFullContent } from './lib/contentStore';

export default function App() {
  useEffect(() => {
    // Preload flat-file content.json into memory
    loadFullContent();
  }, []);

  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Website */}
          <Route path="/" element={<PublicHome />} />

          {/* Unified Authentication Portal (/login with Client & Admin tabs) */}
          <Route path="/login" element={<AuthLogin />} />
          <Route path="/admin/login" element={<AuthLogin />} />

          {/* One-Time Admin Setup Wizard */}
          <Route path="/setup" element={<SetupPage />} />

          {/* Protected Client Portal */}
          <Route
            path="/account"
            element={
              <ClientGuard>
                <ClientAccount />
              </ClientGuard>
            }
          />

          {/* Protected Admin Console Routes */}
          <Route
            path="/admin"
            element={
              <AdminGuard>
                <AdminLayout />
              </AdminGuard>
            }
          >
            <Route index element={<AdminDashboard />} />
            <Route path="global" element={<AdminGlobalEditor />} />
            <Route path="hero" element={<AdminHeroEditor />} />
            <Route path="about" element={<AdminAboutEditor />} />
            <Route path="services" element={<AdminServicesEditor />} />
            <Route path="process" element={<AdminProcessEditor />} />
            <Route path="projects" element={<AdminProjectsEditor />} />
            <Route path="technologies" element={<AdminTechEditor />} />
            <Route path="comparison" element={<AdminComparisonEditor />} />
            <Route path="pricing" element={<AdminPricingEditor />} />
            <Route path="testimonials" element={<AdminTestimonialsEditor />} />
            <Route path="blog" element={<AdminBlogEditor />} />
            <Route path="leads" element={<AdminLeadsInbox />} />
            <Route path="activity" element={<AdminActivityLog />} />
            <Route
              path="users"
              element={
                <AdminGuard requiredRole="super_admin">
                  <AdminUsers />
                </AdminGuard>
              }
            />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
