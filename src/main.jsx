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
import { ThemeProvider } from './contexts/ThemeContext.jsx'

const Root = () => {
  return (
    <StrictMode>
      <ThemeProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/manage-projects" element={<ManageProjects />} />
            <Route path="/manage-skills" element={<ManageSkills />} />
            <Route path="/manage-certificates" element={<ManageCertificates />} />
            <Route path="/" element={<App />} />
            {/* Redirect ke login jika rute tidak ditemukan */}
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </Router>
      </ThemeProvider>
    </StrictMode>
  )
}

createRoot(document.getElementById('root')).render(<Root />)