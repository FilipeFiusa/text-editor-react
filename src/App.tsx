import { Route, Routes } from 'react-router-dom';
import PersistLogin from './components/PersistLogin';
import RequireAuth from './components/RequireAuth';
import Login from './pages/Login';
import Register from './pages/Register';
import Workspace from './pages/Workspace';

function App() {
  return (
    <div>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />

        <Route element={ <PersistLogin /> }>
          <Route element={<RequireAuth />}>
              <Route path="/" element={<Workspace />} />
          </Route>
        </Route>
      </Routes>
    </div>

  );
}

export default App;
