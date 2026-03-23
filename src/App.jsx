import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Favorites from './pages/Favorites';
import Currency from './pages/Currency';
import News from './pages/News';
import Portfolio from './pages/Portfolio';

function App() {
  return (
    <BrowserRouter basename="/GVKStockinsights">
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="portfolio" element={<Portfolio />} />
          <Route path="favorites" element={<Favorites />} />
          <Route path="currency" element={<Currency />} />
          <Route path="news" element={<News />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
