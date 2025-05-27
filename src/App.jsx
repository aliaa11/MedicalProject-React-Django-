import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
// import './App.css'
import { Routes, Route } from 'react-router-dom'
import ListDoctors from './features/doctors/pages/ListDoctors'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>

      <Routes>
        <Route path="/doctors" element={<ListDoctors/>}/>
      </Routes>
    </>
  )
}

export default App
