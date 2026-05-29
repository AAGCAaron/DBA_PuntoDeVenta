import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert, TextInput } from 'react-native';
import api from '../api/client';

export default function ProductosScreen({ navigation }) {
  const [productos, setProductos] = useState([]);
  const [busqueda, setBusqueda] = useState('');

  async function cargar() {
    try {
      const { data } = await api.get('/productos/');
      setProductos(data);
    } catch {
      Alert.alert('Error', 'No se pudieron cargar los productos');
    }
  }

  useEffect(() => { cargar(); }, []);

  const filtrados = productos.filter(p =>
    p.nombre_producto.toLowerCase().includes(busqueda.toLowerCase()) ||
    p.codigo_barras.includes(busqueda)
  );

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.search}
        placeholder="Buscar por nombre o código..."
        value={busqueda}
        onChangeText={setBusqueda}
      />
      <FlatList
        data={filtrados}
        keyExtractor={(item) => String(item.id_producto)}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={{ flex: 1 }}>
              <Text style={styles.nombre}>{item.nombre_producto}</Text>
              <Text style={styles.sub}>Código: {item.codigo_barras}</Text>
              <Text style={styles.sub}>Stock: {item.stock} | Precio: ${item.precio_venta}</Text>
            </View>
            {item.tiene_imagen && <Text style={styles.img}>🖼️</Text>}
          </View>
        )}
        ListEmptyComponent={<Text style={styles.empty}>Sin productos</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5', padding: 16 },
  search: { backgroundColor: '#fff', borderRadius: 8, padding: 12, marginBottom: 12, borderWidth: 1, borderColor: '#ddd' },
  card: { backgroundColor: '#fff', borderRadius: 10, padding: 14, marginBottom: 10, flexDirection: 'row', alignItems: 'center', elevation: 1 },
  nombre: { fontWeight: 'bold', fontSize: 15, color: '#222' },
  sub: { color: '#666', fontSize: 13, marginTop: 2 },
  img: { fontSize: 22 },
  empty: { textAlign: 'center', marginTop: 40, color: '#999' },
});
