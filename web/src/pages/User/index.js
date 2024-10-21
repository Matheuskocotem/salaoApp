import React, { useState } from 'react';

const Login = () => {
  const [cpf, setCpf] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    setError('');

    // Simulação de login com credenciais fixas
    const mockCpf = '12345678900';
    const mockPassword = 'senha123';

    if (cpf === mockCpf && password === mockPassword) {
      setIsLoggedIn(true);
    } else {
      setError('CPF ou senha incorretos. Tente novamente.');
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
                <label htmlFor="cpf" className="form-label">CPF</label>
                <input
                  type="text"
                  className="form-control"
                  id="cpf"
                  value={cpf}
                  onChange={(e) => setCpf(e.target.value)}
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
