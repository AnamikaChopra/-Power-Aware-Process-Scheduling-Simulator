import React from "react";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import IntroPage from './Components/IntoPage/IntroPage'
import TakeInput from './Components/TakeInput/TakeInput';
import PowSav from './Components/PowerSaving/PowSav';   

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/"          element={<IntroPage />} />
        <Route path="/implement" element={<TakeInput />} />
        <Route path="/PowSav"     element={<PowSav />} />  
      </Routes>
    </Router>
  );
}

export default App;
