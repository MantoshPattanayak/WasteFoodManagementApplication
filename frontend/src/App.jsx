import React, { useState, lazy, Suspense } from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider, withAuth } from './common/AuthProvider';
import persistor from './store/store';
import { Provider } from 'react-redux';

const LandingPage = React.lazy(() => import('./pages/LandingPage/landingPage'))
const DonorLandingPage = (React.lazy(() => import('./pages/DonorPage/DonorLandingPage')))
const DonateHistory = React.lazy(() => import('./pages/DonateHis/DonateHistory'))
const AvailableFood = React.lazy(() => import('./pages/AvailableFood/AvailableFood'))
const LogInSignUp = React.lazy(() => import('./pages/LoginPage/LogInSignUp'))
const DonorDetails = (React.lazy(() => import('./pages/DonorPage/DonorDetails')))
const ReceivedHistoryPage = withAuth(React.lazy(() => import('./pages/ReceivedHistory/ReceivedHistoryPage')))
import About from './pages/AboutPage/AboutPage';
function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Provider store={persistor}>
        <AuthProvider>
          <Router basename='/soul'>
            <div>
              <Suspense fallback={<div>Loading...</div>}>
                <Routes>
                  <Route path="/" element={<LandingPage />} />
                  <Route path="/DonorLandingPage" element={<DonorLandingPage />} />
                  <Route path="/DonateHistory" element={<DonateHistory />} />
                  <Route path="/AvailableFood" element={<AvailableFood />} />
                  <Route path="/Login" element={<LogInSignUp />} />
                  <Route path="/ReceivedHistoryPage" element={<ReceivedHistoryPage />} />
                  <Route path="/DonorDetails" element={<DonorDetails />} />
                  <Route path="/About" element={<About />} />
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
