import axios from 'axios';

const API_URL = 'http://localhost:3000';

export const conexion = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const pruebaCon = async () => {
  try {
    const response = await conexion.get('/');
    return response.data;
  } catch (error) {
    console.error('Error al conectar con el backend:', error);
    throw error;
  }
};
