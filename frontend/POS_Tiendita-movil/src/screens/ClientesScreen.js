import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Alert } from 'react-native';
import api from '../api/client';

export default function ClientesScreen() {
  const [clientes, setClientes] = useState([]);

  useEffect(() => {
    api.get('/clientes/').then(({ data }) => setClientes(data)).catch(() => Alert.alert('Error al cargar clientes'));
  }, []);

  return (
    <View style={styles.container}>
      <FlatList
        data={clientes}
        keyExtractor={i => String(i.id_cliente)}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.nombre}>{item.nombre_completo}</Text>
            {item.rfc && <Text style={styles.sub}>RFC: {item.rfc}</Text>}
            {item.correo_electronico && <Text style={styles.sub}>{item.correo_electronico}</Text>}
          </View>
        )}
        ListEmptyComponent={<Text style={styles.empty}>Sin clientes registrados</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5', padding: 16 },
  card: { backgroundColor: '#fff', borderRadius: 10, padding: 14, marginBottom: 10, elevation: 1 },
  nombre: { fontWeight: 'bold', fontSize: 15, color: '#222' },
  sub: { color: '#666', fontSize: 13, marginTop: 2 },
  empty: { textAlign: 'center', marginTop: 40, color: '#999' },
});
