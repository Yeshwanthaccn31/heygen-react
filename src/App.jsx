import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './components/Home'
import Nav from './components/nav'
import ExperienceAkira from './pages/ExperienceAkira'

function App() {
  return (
    <Router>
      <div className="app">
        <Nav />
        <Routes>
          <Route path="/" element={<ExperienceAkira />} />
          <Route path="/home" element={<Home />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
