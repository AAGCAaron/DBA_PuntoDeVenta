import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { AuthProvider, useAuth } from './src/context/AuthContext';
import LoginScreen from './src/screens/LoginScreen';
import HomeScreen from './src/screens/HomeScreen';
import ProductosScreen from './src/screens/ProductosScreen';
import NuevaVentaScreen from './src/screens/NuevaVentaScreen';
import VentasScreen from './src/screens/VentasScreen';
import ClientesScreen from './src/screens/ClientesScreen';
import ProveedoresScreen from './src/screens/ProveedoresScreen';
import CategoriasScreen from './src/screens/CategoriasScreen';

const Stack = createNativeStackNavigator();

function AppNavigator() {
  const { usuario } = useAuth();
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{ headerStyle: { backgroundColor: '#1a73e8' }, headerTintColor: '#fff' }}
      >
        {!usuario ? (
          <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        ) : (
          <>
            <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'POS Tiendita' }} />
            <Stack.Screen name="NuevaVenta" component={NuevaVentaScreen} options={{ title: 'Nueva Venta' }} />
            <Stack.Screen name="Productos" component={ProductosScreen} options={{ title: 'Productos' }} />
            <Stack.Screen name="Ventas" component={VentasScreen} options={{ title: 'Historial de Ventas' }} />
            <Stack.Screen name="Clientes" component={ClientesScreen} options={{ title: 'Clientes' }} />
            <Stack.Screen name="Proveedores" component={ProveedoresScreen} options={{ title: 'Proveedores' }} />
            <Stack.Screen name="Categorias" component={CategoriasScreen} options={{ title: 'Categorías' }} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppNavigator />
    </AuthProvider>
  );
}
