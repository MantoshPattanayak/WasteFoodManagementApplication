import React, { useState, lazy, Suspense } from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
const LandingPage=React.lazy(()=>import('./pages/LandingPage/landingPage'))
const  DonorLandingPage=React.lazy(()=>import('./pages/DonorPage/DonorLandingPage')) 
const DonateHistory=React.lazy(()=>import('./pages/DonateHis/DonateHistory'))
const AvilableFood=React.lazy(()=>import('./pages/AvilableFood/AvilableFood'))

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
   
   <Router basename='/soul'>
      <div>
        <Suspense fallback={<div>Loading...</div>}>
          <Routes>
            <Route path="/" element={<LandingPage />} />
          </Routes>
          <Routes>
            <Route path="/DonorLandingPage" element={<DonorLandingPage />} />
          </Routes>
          <Routes>
            <Route path="/DonateHistory" element={<DonateHistory />} />
          </Routes>
          <Routes>
            <Route path="/AvilableFood" element={<AvilableFood />} />
          </Routes>
        </Suspense>
      </div>
    </Router>
     
    </>
  )
}

export default App
