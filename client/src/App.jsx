import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import Layout from './components/Layout';
import Home from './pages/Home';
import StartSession from './pages/StartSession';
import Timer from './pages/Timer';
import Result from './pages/Result';
import Wardrobe from './pages/Wardrobe';
import Calendar from './pages/Calendar';
import './App.css';

function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/start-session" element={<StartSession />} />
            <Route path="/wardrobe" element={<Wardrobe />} />
            <Route path="/calendar" element={<Calendar />} />
          </Route>
          <Route path="/timer" element={<Timer />} />
          <Route path="/result" element={<Result />} />
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}

export default App;
