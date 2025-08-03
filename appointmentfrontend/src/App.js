import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Signup from './pages/Signup'
import Login from './pages/Login'
import LandingPage from './pages/LandingPage'
import DoctorProfile from './pages/DoctorProfile'
import BookingForm from './pages/BookingForm'
import ProtectedRoute from './pages/ProtectedRoute'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<LandingPage />} />
        <Route
          path="/doctor/:id"
          element={
            <ProtectedRoute>
              <DoctorProfile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/book/:id"
          element={
            <ProtectedRoute>
              <BookingForm />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  )
}

export default App
