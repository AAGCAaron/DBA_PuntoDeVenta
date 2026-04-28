import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Alert } from 'react-native';
import api from '../api/client';

export default function VentasScreen() {
  const [ventas, setVentas] = useState([]);

  useEffect(() => {
    api.get('/ventas/').then(({ data }) => setVentas(data)).catch(() => Alert.alert('Error al cargar ventas'));
  }, []);

  return (
    <View style={styles.container}>
      <FlatList
        data={ventas}
        keyExtractor={i => String(i.id_venta)}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.folio}>Folio #{item.id_venta}</Text>
            <Text style={styles.sub}>{new Date(item.fecha_hora).toLocaleString()}</Text>
            <Text style={styles.total}>Total: ${item.monto_total}</Text>
            {item.tiene_factura && <Text style={styles.factura}>📄 Factura adjunta</Text>}
          </View>
        )}
        ListEmptyComponent={<Text style={styles.empty}>Sin ventas registradas</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5', padding: 16 },
  card: { backgroundColor: '#fff', borderRadius: 10, padding: 14, marginBottom: 10, elevation: 1 },
  folio: { fontWeight: 'bold', fontSize: 15, color: '#222' },
  sub: { color: '#888', fontSize: 12, marginTop: 2 },
  total: { color: '#1a73e8', fontWeight: 'bold', marginTop: 4 },
  factura: { color: '#43a047', marginTop: 4 },
  empty: { textAlign: 'center', marginTop: 40, color: '#999' },
});
