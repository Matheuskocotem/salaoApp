import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState } from 'react';

import './styles.css';

import Header from "./components/Header";
import Sidebar from "./components/Sidebar";

import Agendamentos from "./pages/Agendamentos";
import Clientes from "./pages/Clientes";
import Login from "./components/Salao/Login";

const AppRoutes = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <Router>
      <Routes>
        {/* Rota de Login */}
        <Route path="/login" element={<Login onLogin={() => setIsAuthenticated(true)} />} />

        {/* Rotas protegidas */}
        <Route 
          path="*"
          element={
            isAuthenticated ? (
              <>
                <Header />
                <div className="container-fluid h-100">
                  <div className="row h-100">
                    <Sidebar />
                    <main className="col">
                      <Routes>
                        <Route path="/" element={<Agendamentos />} />
                        <Route path="/clientes" element={<Clientes />} />
                        {/* Redireciona para a página de login se não estiver autenticado */}
                        <Route path="*" element={<Navigate to="/" />} />
                      </Routes>
                    </main>
                  </div>
                </div>
              </>
            ) : (
              // Redireciona para a página de login se não estiver autenticado
              <Navigate to="/login" />
            )
          }
        />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
