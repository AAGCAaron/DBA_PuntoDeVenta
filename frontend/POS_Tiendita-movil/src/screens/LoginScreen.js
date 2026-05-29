import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useAuth } from '../context/AuthContext';

export default function LoginScreen() {
  const { login } = useAuth();
  const [usuario, setUsuario] = useState('');
  const [password, setPassword] = useState('');
  const [cargando, setCargando] = useState(false);

  async function handleLogin() {
    if (!usuario || !password) return Alert.alert('Completa todos los campos');
    setCargando(true);
    try {
      await login(usuario, password);
    } catch {
      Alert.alert('Error', 'Credenciales incorrectas');
    } finally {
      setCargando(false);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>POS Tiendita</Text>
      <TextInput
        style={styles.input}
        placeholder="Usuario"
        autoCapitalize="none"
        value={usuario}
        onChangeText={setUsuario}
      />
      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <TouchableOpacity style={styles.btn} onPress={handleLogin} disabled={cargando}>
        <Text style={styles.btnText}>{cargando ? 'Entrando...' : 'Iniciar sesión'}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 32, backgroundColor: '#f5f5f5' },
  title: { fontSize: 28, fontWeight: 'bold', textAlign: 'center', marginBottom: 40, color: '#1a73e8' },
  input: { backgroundColor: '#fff', borderRadius: 8, padding: 14, marginBottom: 16, borderWidth: 1, borderColor: '#ddd' },
  btn: { backgroundColor: '#1a73e8', borderRadius: 8, padding: 16, alignItems: 'center' },
  btnText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});
