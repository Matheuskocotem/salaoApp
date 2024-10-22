import React, { useState } from 'react';
import api from '../../services/api'; 

const Login = () => {
  const [userType, setUserType] = useState('cliente');
  const [email, setEmail] = useState(''); 
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    const endpoint = userType === 'cliente' ? '/cliente/login' : '/salao/login';

    try {
      const response = await api.post(endpoint, { email, senha: password }); 

      if (response.data.error) {
        setError(response.data.message || 'Erro ao fazer login. Tente novamente.');
      } else {
        localStorage.setItem('token', response.data.token);
        setIsLoggedIn(true);
      }
    } catch (err) {
      setError('Erro ao conectar à API. Tente novamente.');
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <div className="col-md-4">
        {isLoggedIn ? (
          <h3 className="text-center mb-4">Bem-vindo! Você está logado.</h3>
        ) : (
          <>
            <h3 className="text-center mb-4">Login</h3>
            {error && <div className="alert alert-danger">{error}</div>}
            <form onSubmit={handleLogin}>
              <div className="mb-3">
                <label htmlFor="userType" className="form-label">Tipo de Usuário</label>
                <select
                  id="userType"
                  className="form-select"
                  value={userType}
                  onChange={(e) => setUserType(e.target.value)}
                  required
                >
                  <option value="cliente">Cliente</option>
                  <option value="salao">Salão</option>
                </select>
              </div>
              <div className="mb-3">
                <label htmlFor="email" className="form-label">Email</label> {/* Alterado de CPF para Email */}
                <input
                  type="email" 
                  className="form-control"
                  id="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)} 
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="password" className="form-label">Senha</label>
                <input
                  type="password"
                  className="form-control"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <button type="submit" className="btn btn-primary w-100">
                Entrar
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default Login;
