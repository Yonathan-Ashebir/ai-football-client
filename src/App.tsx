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
import ChatBot, {Message} from "./components/Chatbot.tsx";
import {useState} from "react";

function App() {
  const [messages, setMessages] = useState<Message[]>([
    {id: "1", timestamp: new Date(), content: "Hello", type: "assistant", streamStatus: "stream-start"},
    {id: "2", timestamp: new Date(), content: ", there\n", type: "assistant", streamStatus: "stream-data"},
    {id: "3", timestamp: new Date(), content: "How are you?", type: "assistant", streamStatus: "stream-end"},
    {id: "4", timestamp: new Date(), content: "I hope ", type: "assistant", streamStatus: "stream-start"},
    {id: "5", timestamp: new Date(), content: "I hope you are doing fi", type: "assistant", streamStatus: "stream-data"},
    // {id: "6", timestamp: new Date(), content: "some error occurred", type: "assistant", streamStatus: "stream-error"},
  ]);

  return (
    <Router>
      <div
        className="flex flex-col min-h-screen bg-[url('https://wallpapercave.com/wp/wp4236210.jpg')] bg-fixed bg-cover bg-center">
        <Navbar/>
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home/>}/>
            <Route path="/match-prediction" element={<MatchPrediction/>}/>
            <Route path="/player-analysis" element={<PlayerAnalysis/>}/>
            <Route path="/datasets" element={<Datasets/>}/>
            <Route path="/models" element={<Models/>}/>
            <Route path="/tournament" element={<Tournament/>}/>
            <Route path="/upcoming-matches" element={<UpcomingMatches/>}/>
          </Routes>
          <ChatBot messages={messages} onMessage={(msg) => setMessages([...messages, {
            id: msg,
            type: 'user',
            content: msg,
            timestamp: new Date()
          }])}
                   onInterrupt={() => {
                   }} onRetry={() => {
          }}/>
        </main>
        <Footer/>
      </div>
    </Router>
  );
}

export default App;