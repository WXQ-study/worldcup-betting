import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Predictions from './pages/Predictions';
import BettingRecords from './pages/BettingRecords';
import Matches from './pages/Matches';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="predictions" element={<Predictions />} />
          <Route path="matches" element={<Matches />} />
          <Route path="bets" element={<BettingRecords />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
