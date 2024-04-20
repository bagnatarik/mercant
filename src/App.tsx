import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

import './App.css'
import Dashboard from './components/Dashboard';
import { parseFromTelegram } from './utils/Telegram';
import axios from 'axios';
import { Toaster, toast } from 'sonner';

function App() {

  const login = async () => {
    const id = parseFromTelegram().id

    if (id) {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}bot/login`, {
        "user_id": id,
        "plateform": "telegram"
      })
      toast.success("Bienvenue")
      localStorage.setItem('token', response.data["token"])
      localStorage.setItem('user_id', response.data["user_id"])
    }
    else {
      toast.error('We can\'t connect please open it on telegram')
    }
  }

  login()

  return (
    <>
      <Dashboard />
      <Toaster richColors position="top-right" />
    </>
  )
}

export default App
