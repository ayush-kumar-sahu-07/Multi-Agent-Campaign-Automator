import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ThemeProvider } from './context/ThemeContext'
import { WorkflowProvider } from './context/WorkflowContext'
import { AuthProvider } from './context/AuthContext'
import Layout from './components/Layout'
import ProtectedRoute from './components/ProtectedRoute'
import LandingPage from './pages/LandingPage'
import CreateCampaign from './pages/CreateCampaign'
import WorkflowProgress from './pages/WorkflowProgress'
import FinalBrief from './pages/FinalBrief'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import DashboardPage from './pages/DashboardPage'

function App() {
  return (
    <ThemeProvider>
      <WorkflowProvider>
        <AuthProvider>
          <Router>
            <Layout>
              <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route
                  path="/create"
                  element={(
                    <ProtectedRoute>
                      <CreateCampaign />
                    </ProtectedRoute>
                  )}
                />
                <Route
                  path="/workflow"
                  element={(
                    <ProtectedRoute>
                      <WorkflowProgress />
                    </ProtectedRoute>
                  )}
                />
                <Route
                  path="/brief"
                  element={(
                    <ProtectedRoute>
                      <FinalBrief />
                    </ProtectedRoute>
                  )}
                />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignupPage />} />
                <Route
                  path="/dashboard"
                  element={(
                    <ProtectedRoute>
                      <DashboardPage />
                    </ProtectedRoute>
                  )}
                />
              </Routes>
            </Layout>
          </Router>
        </AuthProvider>
      </WorkflowProvider>
    </ThemeProvider>
  )
}

export default App
