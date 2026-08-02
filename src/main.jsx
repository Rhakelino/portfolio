import React from 'react'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import Login from './Pages/login.jsx'
import Dashboard from './Pages/dashboard.jsx'
import ManageProjects from './Pages/manage-projects.jsx'
import ManageSkills from './Pages/manage-skills.jsx'
import ManageCertificates from './Pages/manage-certificates.jsx'
import ManageSettings from './Pages/manage-settings.jsx'
import ProjectDetail from './Pages/ProjectDetail.jsx'
import PrivateRoute from './Pages/PrivateRoute.jsx'
import { ThemeProvider } from './contexts/ThemeContext.jsx'
import { Toaster } from '@/components/ui/sonner'
import DashboardLayout from './components/admin/DashboardLayout.jsx'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // Data fresh selama 5 menit
      refetchOnWindowFocus: false, // Tidak refetch tiap kali pindah tab browser
    },
  },
})

const Root = () => {
  return (
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <Router>
          <Routes>
            <Route path="/login" element={<Login />} />

            {/* Admin Routes with Layout */}
            <Route element={
              <PrivateRoute>
                <DashboardLayout />
              </PrivateRoute>
            }>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/manage-projects" element={<ManageProjects />} />
              <Route path="/manage-skills" element={<ManageSkills />} />
              <Route path="/manage-certificates" element={<ManageCertificates />} />
              <Route path="/manage-settings" element={<ManageSettings />} />
            </Route>

            {/* Public Routes */}
            <Route path="/" element={<App />} />
            <Route path="/project/:id" element={<ProjectDetail />} />

            {/* Redirect ke home jika rute tidak ditemukan */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
        <Toaster />
      </ThemeProvider>
    </QueryClientProvider>
    </StrictMode>
  )
}

createRoot(document.getElementById('root')).render(<Root />)