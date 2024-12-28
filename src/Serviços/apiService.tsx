import axios from 'axios';

// Configuração inicial do Axios
const api = axios.create({
  baseURL: 'http://localhost:8080/api', // Substitua pelo endpoint base do back-end
  headers: {
    'Content-Type': 'application/json',
  },
});

// Endpoints para Feira e Horta
const apiService = {
  cadastrarFeiraOuHorta: (dados: any) => api.post('/cadastro', dados),
  buscarFeiras: () => api.get('/feiras'),
  buscarHortas: () => api.get('/hortas'),
};

export default apiService;