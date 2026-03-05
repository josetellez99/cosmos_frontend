import './App.css'
import { Routes, Route } from "react-router";
import { RegisterPage } from '@/pages/register-page';

function App() {

  return (
    <Routes>
      <Route path="/" element={<p>Hello world</p>} />
      <Route path="/register" element={<RegisterPage />} />
    </Routes>
  )
}

export default App
