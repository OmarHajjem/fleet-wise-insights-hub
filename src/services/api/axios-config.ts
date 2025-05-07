
import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';

// Déterminer si nous utilisons des données fictives ou réelles
export const useRealApi = (): boolean => {
  return localStorage.getItem('useRealApi') === 'true';
};

// Configuration de base d'Axios
const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

export const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 secondes
});

// Intercepteur pour les requêtes
axiosInstance.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    // Ajoutez ici la logique pour les tokens d'authentification si nécessaire
    const token = localStorage.getItem('authToken');
    if (token && config.headers) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Intercepteur pour les réponses
axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    // Gérer les erreurs globalement (401, 403, 500, etc.)
    if (error.response?.status === 401) {
      // Rediriger vers la page de connexion ou rafraîchir le token
      console.log('Session expirée, redirection vers la page de connexion');
      // Logique de déconnexion ici
    }
    return Promise.reject(error);
  }
);

// Type d'erreur API personnalisé
export interface ApiError {
  message: string;
  code?: string;
  status?: number;
}

// Fonction utilitaire pour transformer les erreurs Axios en format standardisé
export const handleApiError = (error: unknown): ApiError => {
  if (axios.isAxiosError(error) && error.response) {
    return {
      message: error.response.data?.message || 'Une erreur est survenue',
      code: error.response.data?.code,
      status: error.response.status
    };
  }
  return { 
    message: error instanceof Error ? error.message : 'Une erreur inconnue est survenue'
  };
};
