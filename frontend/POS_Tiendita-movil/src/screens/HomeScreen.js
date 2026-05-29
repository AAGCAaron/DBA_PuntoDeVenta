import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useAuth } from '../context/AuthContext';

const MODULOS = [
  { label: 'Nueva Venta', route: 'NuevaVenta', emoji: '🛒' },
  { label: 'Productos', route: 'Productos', emoji: '📦' },
  { label: 'Clientes', route: 'Clientes', emoji: '👤' },
  { label: 'Proveedores', route: 'Proveedores', emoji: '🏭' },
  { label: 'Categorías', route: 'Categorias', emoji: '🏷️' },
  { label: 'Historial Ventas', route: 'Ventas', emoji: '📋' },
];

export default function HomeScreen({ navigation }) {
  const { usuario, logout } = useAuth();

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Bienvenido, {usuario?.nombre_usuario}</Text>
      <View style={styles.grid}>
        {MODULOS.map((m) => (
          <TouchableOpacity key={m.route} style={styles.card} onPress={() => navigation.navigate(m.route)}>
            <Text style={styles.emoji}>{m.emoji}</Text>
            <Text style={styles.label}>{m.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <TouchableOpacity style={styles.logout} onPress={logout}>
        <Text style={styles.logoutText}>Cerrar sesión</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: '#f5f5f5', flexGrow: 1 },
  header: { fontSize: 20, fontWeight: 'bold', marginBottom: 24, color: '#333' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  card: {
    width: '47%', backgroundColor: '#fff', borderRadius: 12,
    padding: 20, alignItems: 'center', elevation: 2,
  },
  emoji: { fontSize: 32, marginBottom: 8 },
  label: { fontWeight: '600', color: '#444', textAlign: 'center' },
  logout: { marginTop: 32, alignItems: 'center' },
  logoutText: { color: '#e53935', fontWeight: '600' },
});
