import React, { useState, lazy, Suspense } from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider, withAuth } from './common/AuthProvider';
import persistor from './store/store';
import { Provider } from 'react-redux';
const ProtectedRoute = React.lazy(() => import('./services/ProtectedRoute'))
const LandingPage = React.lazy(() => import('./pages/LandingPage/landingPage'))
const DonorLandingPage = withAuth(React.lazy(() => import('./pages/DonorPage/DonorLandingPage')))
const DonateHistory = withAuth(React.lazy(() => import('./pages/DonateHis/DonateHistory')))
const AvailableFood = React.lazy(() => import('./pages/AvailableFood/AvailableFood'))
const LogInSignUp = React.lazy(() => import('./pages/LoginPage/LogInSignUp'))
const DonorDetails = withAuth(React.lazy(() => import('./pages/DonorPage/DonorDetails')))
const ReceivedHistoryPage = withAuth(React.lazy(() => import('./pages/ReceivedHistory/ReceivedHistoryPage')))
const About = React.lazy(() => import('./pages/AboutPage/AboutPage'));
const Registration = React.lazy(() => import('./pages/RegistrationForm/Registration'))
const Profile = React.lazy(() => import('./pages/Profile/Profile'))
const Fooddetails=React.lazy(()=>import('./pages/fooddetails/fooddetails'))

function App() {

  return (
    <>
      <Provider store={persistor}>
        <AuthProvider>
          <Router basename='/soul'>
            <div>
              <Suspense fallback={<div>Loading...</div>}>
                <Routes>
                  <Route path="/" element={<ProtectedRoute><LandingPage /></ProtectedRoute>} />
                  <Route path="/DonorLandingPage" element={<ProtectedRoute><DonorLandingPage /></ProtectedRoute>} />
                  <Route path="/DonateHistory" element={<ProtectedRoute><DonateHistory /></ProtectedRoute>} />
                  <Route path="/AvailableFood" element={<AvailableFood />} />
                  <Route path="/Login" element={<ProtectedRoute><LogInSignUp /></ProtectedRoute>} />
                  <Route path="/ReceivedHistoryPage" element={<ProtectedRoute><ReceivedHistoryPage /></ProtectedRoute>} />
                  <Route path="/DonorDetails" element={<ProtectedRoute><DonorDetails /></ProtectedRoute>} />
                  <Route path="/About" element={<About />} />
                  <Route path="/Registration" element={<Registration />} />
                  <Route path="/Profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                  <Route path="/Fooddetails" element={<ProtectedRoute><Fooddetails/></ProtectedRoute>} />
                </Routes>
              </Suspense>
            </div>
          </Router>
        </AuthProvider>
      </Provider>
    </>
  )
}

export default App
