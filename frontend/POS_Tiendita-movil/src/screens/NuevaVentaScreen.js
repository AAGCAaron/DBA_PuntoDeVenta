import React, { useEffect, useState } from 'react';
import {
  View, Text, FlatList, TouchableOpacity, StyleSheet,
  Alert, TextInput, ScrollView
} from 'react-native';
import api from '../api/client';

export default function NuevaVentaScreen({ navigation }) {
  const [productos, setProductos] = useState([]);
  const [carrito, setCarrito] = useState([]);
  const [busqueda, setBusqueda] = useState('');

  useEffect(() => {
    api.get('/productos/').then(({ data }) => setProductos(data)).catch(() => {});
  }, []);

  function agregarProducto(producto) {
    setCarrito(prev => {
      const existe = prev.find(i => i.id_producto === producto.id_producto);
      if (existe) {
        return prev.map(i =>
          i.id_producto === producto.id_producto ? { ...i, cantidad: i.cantidad + 1 } : i
        );
      }
      return [...prev, { ...producto, cantidad: 1 }];
    });
  }

  function quitarProducto(id_producto) {
    setCarrito(prev => prev.filter(i => i.id_producto !== id_producto));
  }

  const total = carrito.reduce((acc, i) => acc + i.cantidad * parseFloat(i.precio_venta), 0);

  async function procesarVenta() {
    if (carrito.length === 0) return Alert.alert('Carrito vacío');
    const body = {
      id_usuario: 1,
      detalle: carrito.map(i => ({
        id_producto: i.id_producto,
        cantidad: i.cantidad,
        precio_unitario: parseFloat(i.precio_venta),
      })),
    };
    try {
      await api.post('/ventas/', body);
      Alert.alert('Venta registrada', `Total: $${total.toFixed(2)}`, [
        { text: 'OK', onPress: () => { setCarrito([]); navigation.goBack(); } },
      ]);
    } catch (e) {
      Alert.alert('Error', e.response?.data?.detail || 'No se pudo registrar la venta');
    }
  }

  const filtrados = productos.filter(p =>
    p.nombre_producto.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <TextInput style={styles.search} placeholder="Buscar producto..." value={busqueda} onChangeText={setBusqueda} />

      <Text style={styles.sec}>Productos disponibles</Text>
      <FlatList
        data={filtrados}
        keyExtractor={i => String(i.id_producto)}
        style={{ maxHeight: 240 }}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.prodRow} onPress={() => agregarProducto(item)}>
            <Text style={styles.prodNombre}>{item.nombre_producto}</Text>
            <Text style={styles.prodPrecio}>${item.precio_venta}</Text>
          </TouchableOpacity>
        )}
      />

      <Text style={styles.sec}>Carrito</Text>
      <ScrollView style={{ flex: 1 }}>
        {carrito.map(i => (
          <View key={i.id_producto} style={styles.carritoRow}>
            <Text style={{ flex: 1 }}>{i.nombre_producto} x{i.cantidad}</Text>
            <Text>${(i.cantidad * parseFloat(i.precio_venta)).toFixed(2)}</Text>
            <TouchableOpacity onPress={() => quitarProducto(i.id_producto)}>
              <Text style={styles.quitar}>✕</Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>

      <View style={styles.footer}>
        <Text style={styles.total}>Total: ${total.toFixed(2)}</Text>
        <TouchableOpacity style={styles.btn} onPress={procesarVenta}>
          <Text style={styles.btnText}>Cobrar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#f5f5f5' },
  search: { backgroundColor: '#fff', borderRadius: 8, padding: 12, marginBottom: 8, borderWidth: 1, borderColor: '#ddd' },
  sec: { fontWeight: 'bold', fontSize: 15, marginVertical: 8, color: '#333' },
  prodRow: { backgroundColor: '#fff', borderRadius: 8, padding: 12, marginBottom: 6, flexDirection: 'row', justifyContent: 'space-between' },
  prodNombre: { color: '#222' },
  prodPrecio: { color: '#1a73e8', fontWeight: 'bold' },
  carritoRow: { backgroundColor: '#fff', borderRadius: 8, padding: 12, marginBottom: 6, flexDirection: 'row', alignItems: 'center', gap: 8 },
  quitar: { color: '#e53935', fontWeight: 'bold', fontSize: 16, marginLeft: 8 },
  footer: { borderTopWidth: 1, borderColor: '#ddd', paddingTop: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  total: { fontSize: 18, fontWeight: 'bold', color: '#222' },
  btn: { backgroundColor: '#1a73e8', borderRadius: 8, paddingVertical: 12, paddingHorizontal: 24 },
  btnText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});
