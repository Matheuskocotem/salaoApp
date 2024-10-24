// src/components/User/Login.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Importando useNavigate
import './Login.css'; // Mantenha seu CSS em um arquivo separado
import logo from '../../assets/logo.png';

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(''); // Estado para mensagem de erro
  const [loading, setLoading] = useState(false); // Estado para controle de carregamento
  const navigate = useNavigate(); // Hook para navegação

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Inicia o carregamento
    setError(''); // Limpa a mensagem de erro anterior

    try {
      const response = await fetch('http://localhost:8000/salao/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, senha: password }), 
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Dados retornados:', data); // Log para verificação
        onLogin(data.salao._id); // Atualiza o estado de autenticação
        localStorage.setItem('salaoId', data.salao._id); // Armazenar ID do salão

        navigate('/'); 
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Erro no login'); // Mostra mensagem de erro do servidor
      }
    } catch (error) {
      setError('Erro ao fazer login: ' + error.message);
    } finally {
      setLoading(false); // Para o carregamento
    }
  };

  return (
    <div id="main">
      <div id="main-container">
        <div id="logoArea">
          <img src={logo} alt="Logo" />
        </div>
        <div id="titleArea">
          <h1 className="h1s">Bem-vindo de volta!</h1>
          <p>Faça login para acessar sua conta</p>
        </div>
        {error && <p className="error-message">{error}</p>} {/* Exibe a mensagem de erro */}
        <form id="form" onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" disabled={loading}> {/* Desabilita o botão durante o carregamento */}
            {loading ? 'Carregando...' : 'Entrar'}
          </button>
          <div id="linkForm">
            <a href="/signup" className="link">Não tem uma conta? Cadastre-se</a>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
