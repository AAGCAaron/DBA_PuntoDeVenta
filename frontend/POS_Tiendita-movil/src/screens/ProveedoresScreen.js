import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Alert } from 'react-native';
import api from '../api/client';

export default function ProveedoresScreen() {
  const [proveedores, setProveedores] = useState([]);

  useEffect(() => {
    api.get('/proveedores/').then(({ data }) => setProveedores(data)).catch(() => Alert.alert('Error'));
  }, []);

  return (
    <View style={styles.container}>
      <FlatList
        data={proveedores}
        keyExtractor={i => String(i.id_proveedor)}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.nombre}>{item.razon_social}</Text>
            <Text style={styles.sub}>RFC: {item.rfc}</Text>
            {item.telefono_contacto && <Text style={styles.sub}>Tel: {item.telefono_contacto}</Text>}
          </View>
        )}
        ListEmptyComponent={<Text style={styles.empty}>Sin proveedores</Text>}
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
