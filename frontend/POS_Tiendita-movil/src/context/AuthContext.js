import React, { createContext, useState, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../api/client';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null);

  async function login(nombre_usuario, password) {
    const form = new URLSearchParams();
    form.append('username', nombre_usuario);
    form.append('password', password);
    const { data } = await api.post('/auth/login', form.toString(), {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });
    await AsyncStorage.setItem('access_token', data.access_token);
    setUsuario({ nombre_usuario });
  }

  async function logout() {
    await AsyncStorage.removeItem('access_token');
    setUsuario(null);
  }

  return (
    <AuthContext.Provider value={{ usuario, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
