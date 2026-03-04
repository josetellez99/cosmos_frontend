import './App.css'
import { Routes, Route } from "react-router";

function App() {

  return (
    <Routes>
      <Route path="/" element={<p>Hello world</p>} />
      <Route path="/register" element={<p>Register form</p>} />
    </Routes>
  )
}

export default App
