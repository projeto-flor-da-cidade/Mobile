import axios from 'axios';

// Configuração base do Axios
const api = axios.create({
  baseURL: 'http://localhost:8081/api', // Substitua pela URL do back-end
  headers: {
    'Content-Type': 'application/json',
  },
});

// Endpoints encapsulados
const apiService = {
  // Cadastro de feira ou horta
  cadastrarFeiraOuHorta: (dados: any) => api.post('/cadastro', dados),

  // Busca todas as feiras
  buscarFeiras: () => api.get('/feiras'),

  // Busca todas as hortas
  buscarHortas: () => api.get('/hortas'),
};

export default apiService;
