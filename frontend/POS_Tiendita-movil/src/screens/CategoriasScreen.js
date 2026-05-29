import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Alert } from 'react-native';
import api from '../api/client';

export default function CategoriasScreen() {
  const [categorias, setCategorias] = useState([]);

  useEffect(() => {
    api.get('/categorias/').then(({ data }) => setCategorias(data)).catch(() => Alert.alert('Error'));
  }, []);

  return (
    <View style={styles.container}>
      <FlatList
        data={categorias}
        keyExtractor={i => String(i.id_categoria)}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.nombre}>{item.nombre}</Text>
            {item.descripcion && <Text style={styles.sub}>{item.descripcion}</Text>}
          </View>
        )}
        ListEmptyComponent={<Text style={styles.empty}>Sin categorías</Text>}
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
