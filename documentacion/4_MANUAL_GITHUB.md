# 🐙 6. Manual para Actualizar GitHub

Este manual explica cómo guardar y subir cualquier cambio que hagas en tu código hacia tu repositorio remoto en GitHub.

> **Repositorio remoto:** `https://github.com/AAGCAaron/DBA_PuntoDeVenta.git`
> **Rama principal:** `main`

---

## 🛠️ Paso a Paso para subir cambios

Siempre que agregues código, cambies estilos, o modifiques documentos, debes abrir la terminal en la raíz de tu proyecto (`/home/agc_aaron/DBA_PuntoDeVenta`) y ejecutar estos **3 comandos**:

### 1. Preparar los cambios (Stage)
Este comando detecta todos los archivos nuevos, modificados o eliminados y los prepara para guardarse:
```bash
git add .
```

### 2. Guardar los cambios (Commit)
Este comando toma una "fotografía" de tu código preparado y le pone un mensaje descriptivo. **Siempre** cambia el mensaje entre comillas para recordar qué hiciste:
```bash
git commit -m "Se agregaron validaciones de nulidad en clientes y se actualizó la guía de Docker"
```

### 3. Subir a GitHub (Push)
Finalmente, este comando envía la fotografía hacia los servidores de GitHub para que todo tu equipo o tu profesora lo puedan ver:
```bash
git push origin main
```

---

## 🔍 Comandos Útiles

Si quieres revisar el estado actual de tu código antes de subirlo:
```bash
git status
```
*(Te dirá qué archivos has tocado y si hay cosas pendientes por guardar).*

Si necesitas ver la lista de las últimas actualizaciones que has guardado:
```bash
git log --oneline
```

---
*POS Tiendita · Bases de Datos Avanzadas · UNAM FI 2026-2*
