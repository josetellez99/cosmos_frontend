import './App.css'
import { RegisterForm } from '@/features/auth/register-form'

function App() {

  const url = import.meta.env.VITE_SERVER_URL

  console.log(url)

  const handleClick = async () => {
    const res = await fetch(`${url}/register`);
    const data = await res.json()
    console.log(data)
  }

  return (
    <>
      Hello world
      <RegisterForm />
      <button onClick={handleClick} className='bg-red-500 text-white'>Click me</button>
    </>
  )
}

export default App
