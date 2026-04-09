import { Routes, Route } from 'react-router-dom'
import Tetris from './pages/Tetris'
import Snake from './pages/Snake'
import FlappyBird from './pages/FlappyBird'
import Tictactoe from './pages/Tictactoe'
import { Home } from './pages/Home'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/tetris" element={<Tetris />} />
      <Route path="/snake" element={<Snake />} />
      <Route path="/flappybird" element={<FlappyBird />} />
      <Route path="/tictactoe" element={<Tictactoe />} />
    </Routes>
  )
}

export default App
