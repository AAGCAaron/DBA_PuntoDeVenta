import { registerRootComponent } from 'expo';

import App from './App';

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
registerRootComponent(App);


const handleSubirImagen = async (idProducto, file) => {
    const form = new FormData();
    form.append('imagen', file);

    // Petición HTTP POST al backend enviando la imagen binaria
    await api.post(`/productos/${idProducto}/imagen`, form, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });
};
