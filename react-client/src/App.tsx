import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pageContainer/Home';
import Students from './pageContainer/Students';
import Hotel from './pageContainer/Hotel';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/students" element={<Students />} />
        <Route path="/hotel" element={<Hotel />} />
      </Routes>
    </Router>
  );
};

export default App;
