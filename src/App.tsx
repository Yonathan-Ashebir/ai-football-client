import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Home from './pages/Home';
import MatchPrediction from './pages/MatchPrediction.tsx';
import PlayerAnalysis from './pages/PlayerAnalysis';
import Datasets from './pages/Datasets';
import Models from './pages/Models';
import Tournament from './pages/Tournament';
import UpcomingMatches from './pages/UpcomingMatches';

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-[url('https://wallpapercave.com/wp/wp4236210.jpg')] bg-fixed bg-cover bg-center">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/match-prediction" element={<MatchPrediction />} />
            <Route path="/player-analysis" element={<PlayerAnalysis />} />
            <Route path="/datasets" element={<Datasets />} />
            <Route path="/models" element={<Models />} />
            <Route path="/tournament" element={<Tournament />} />
            <Route path="/upcoming-matches" element={<UpcomingMatches />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;