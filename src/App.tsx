import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Share from './pages/Share';
import { Layout } from './components/Layout';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/share" element={<Share />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
