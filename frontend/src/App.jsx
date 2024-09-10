import React, { useState, lazy, Suspense } from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
const LandingPage=React.lazy(()=>import('./pages/LandingPage/landingPage'))
const  DonorLandingPage=React.lazy(()=>import('./pages/DonorPage/DonorLandingPage')) 
const DonateHistory=React.lazy(()=>import('./pages/DonateHis/DonateHistory'))
const AvilableFood=React.lazy(()=>import('./pages/AvilableFood/AvilableFood'))
const LogInSignUp = React.lazy(() => import('./pages/LoginPage/LogInSignUp'))

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
   
   <Router basename='/soul'>
      <div>
        <Suspense fallback={<div>Loading...</div>}>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/DonorLandingPage" element={<DonorLandingPage />} />
            <Route path="/DonateHistory" element={<DonateHistory />} />
            <Route path="/AvilableFood" element={<AvilableFood />} />
            <Route path="/Login" element={<LogInSignUp />} />
          </Routes>
        </Suspense>
      </div>
    </Router>
     
    </>
  )
}

export default App
