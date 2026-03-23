import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Favorites from './pages/Favorites';
import Currency from './pages/Currency';
import News from './pages/News';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="favorites" element={<Favorites />} />
        <Route path="currency" element={<Currency />} />
        <Route path="news" element={<News />} />
      </Route>
    </Routes>
  );
}

export default App;
