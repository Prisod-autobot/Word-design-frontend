import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ComboPage from './pages/comboPage';

function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<ComboPage />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
