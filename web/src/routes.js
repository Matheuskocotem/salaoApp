import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import './styles.css';

import Header from "./components/Header";
import Sidebar from "./components/Sidebar";

import Agendamentos from "./pages/Agendamentos";
import Clientes from "./pages/Clientes";

const AppRoutes = () => {
  return (
    <>
      <Header />
      <div className="container-fluid h-100">
        <div className="row h-100">
          <Router>
            <Sidebar />
            <main className="col">
              <Routes>
                <Route path="/" element={<Agendamentos />} />
                <Route path="/clientes" element={<Clientes />} />
              </Routes>
            </main>
          </Router>
        </div>
      </div>
    </>
  );
};

export default AppRoutes;
