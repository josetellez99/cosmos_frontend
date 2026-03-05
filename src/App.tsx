import './App.css'
import { Routes, Route } from "react-router";
import { RegisterPage } from '@/pages/register-page';
import { LoginPage } from '@/pages/login-page';
import { ConfirmEmail } from '@/pages/confirm-email';

function App() {

  return (
    <Routes>
      <Route path="/" element={<p>Hello world</p>} />

      <Route> {/** Auth routes **/}
        <Route path="register" element={<RegisterPage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="confirm-email" element={<ConfirmEmail />} />
      </Route>


    </Routes>
  )
}

export default App
