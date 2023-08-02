import { useState } from 'react'
import './App.css'
import GestionEntretien from './components/GestionEntretien.jsx';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/entretiens" element={<GestionEntretien />} />
        <Route path="/register" element={<RegisterPage/>} />
        <Route path="/login" element={<LoginPage/>} />


      </Routes>
    </BrowserRouter>
  );
}


export default App
