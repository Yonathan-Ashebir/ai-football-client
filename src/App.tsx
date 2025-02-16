import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import ScrollToTop from './components/ScrollToTop';
import Home from './pages/Home';
import MatchPrediction from './pages/MatchPrediction.tsx';
import PlayerAnalysis from './pages/PlayerAnalysis';
import Datasets from './pages/Datasets';
import Models from './pages/Models';
import Tournament from './pages/Tournament';
import UpcomingMatches from './pages/UpcomingMatches';
import {Assistant} from "./components/Assistant.tsx";

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Navbar/>
        <div
          className="flex-grow flex flex-col bg-[url('https://wallpapercave.com/wp/wp4236210.jpg')] bg-fixed bg-cover bg-center"
          style={{paddingTop: '4rem'}}
        >
          <main className="flex-grow h-full">
            <Routes>
              <Route path="/" element={<Home/>}/>
              <Route path="/match-prediction" element={<MatchPrediction/>}/>
              <Route path="/player-analysis" element={<PlayerAnalysis/>}/>
              <Route path="/datasets" element={<Datasets/>}/>
              <Route path="/models" element={<Models/>}/>
              <Route path="/tournament" element={<Tournament/>}/>
              <Route path="/upcoming-matches" element={<UpcomingMatches/>}/>
            </Routes>
          </main>
          <Footer/>
        </div>
        <div className="flex flex-col fixed bottom-6 right-6 items-center z-50">
          <Assistant/>
          <ScrollToTop/>
        </div>
      </div>
    </Router>
  );
}

export default App;