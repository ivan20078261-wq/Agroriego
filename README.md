<div align="center">

<img src="assets/images/icon.png" alt="Agroriego" width="128" />

# Agroriego

**Gestión inteligente de riego para viñedos — monitoreo de lotes, sensores y turnos de riego en la palma de tu mano.**

[![Expo](https://img.shields.io/badge/Expo-58-208AEF?style=flat-square&logo=expo&logoColor=white)](https://expo.dev)
[![React Native](https://img.shields.io/badge/React_Native-0.88-61DAFB?style=flat-square&logo=react&logoColor=black)](https://reactnative.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-6.0-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![License](https://img.shields.io/badge/Licencia-MIT-3DBA2F?style=flat-square)](LICENSE)

</div>

---

## Acerca del proyecto

**Agroriego** es una aplicación móvil multiplataforma (Android, iOS y Web) para el manejo del riego de fincas. Permite monitorear el estado hídrico de cada lote, controlar sensores de humedad de suelo, programar turnos de riego y llevar un historial completo de cada aplicación de agua.

Diseñada para productores vitivinícolas: con un vistazo sabés qué lote está en riego, cuál sufre estrés hídrico y cuál tiene su próximo turno programado.

## Características

- **Inicio** — Calendario con fechas de riego, próximos turnos y monitoreo rápido del estado de los lotes.
- **Sensores** — Control total de lotes: iniciar/detener riego en curso, programar turnos y vincular sensores con animaciones.
- **Monitoreo de lotes** — Estados visuales por lote (`riego`, `estrés`, `programado`) con humedad, caudal y lecturas de sensores a 30 y 60 cm de profundidad.
- **Gráficos por lote** — Series temporales de humedad de suelo dibujadas con SVG nativo (`react-native-svg`).
- **Historial** — Registro de cada riego con duración, litros aplicados y estado (en curso / finalizado), con formato local `es-AR`.
- **Perfil** — Datos del operador de la finca.
- **Persistencia local** — Los datos sobreviven reinicios de la app mediante `AsyncStorage`.

## Estructura del proyecto

```text
src/
├── app/                  # Rutas con Expo Router (enrutamiento basado en archivos)
│   ├── _layout.tsx       # Layout raíz
│   ├── (tabs)/           # Pestañas principales
│   │   ├── index.tsx     # Inicio
│   │   ├── Sensores.tsx  # Sensores y control de riego
│   │   ├── Historial.tsx # Historial de riegos
│   │   └── Perfil.tsx    # Perfil de usuario
│   └── graficos/[lote]/  # Gráficos por lote (ruta dinámica)
├── componentes/          # Componentes reutilizables (Calendario, BarraNavegacion, etc.)
├── servicios/            # Capa de datos (lotes, riegos, sensores, perfil)
└── hooks/                # Hooks de tema y esquema de color
```

## Stack tecnológico

| Tecnología | Uso |
| --- | --- |
| [Expo SDK 58](https://expo.dev) | Plataforma de desarrollo universal |
| [Expo Router](https://docs.expo.dev/router/introduction/) | Navegación con tabs y rutas dinámicas |
| [React Native](https://reactnative.dev) + [react-native-web](https://necolas.github.io/react-native-web/) | UI nativa en Android, iOS y Web |
| [TypeScript](https://www.typescriptlang.org) | Tipado estático en todo el proyecto |
| [react-native-svg](https://github.com/software-mansion/react-native-svg) | Gráficos e indicadores animados |
| [AsyncStorage](https://react-native-async-storage.github.io/async-storage/) | Persistencia local de datos |
| [@expo/vector-icons](https://docs.expo.dev/guides/icons/) | Iconografía (MaterialCommunityIcons) |
| [Bricolage Grotesque + Karla](https://fonts.google.com) | Tipografías vía @expo-google-fonts |

## Empezar

### Requisitos

- Node.js 20+
- npm (o el gestor de tu preferencia)
- Expo Go en tu dispositivo para pruebas rápidas

### Instalación

```bash
# 1. Clonar el repositorio
git clone https://github.com/ivan20078261-wq/Agroriego.git
cd Agroriego

# 2. Instalar dependencias
npm install

# 3. Iniciar el servidor de desarrollo
npx expo start
```

Desde la salida del servidor podés abrir la app con Expo Go escaneando el QR, o en un emulador/simulador:

```bash
npx expo start --android   # Android
npx expo start --ios       # iOS
npx expo start --web       # Web
```

## Scripts disponibles

| Comando | Descripción |
| --- | --- |
| `npm start` | Inicia el servidor de desarrollo de Expo |
| `npm run android` | Abre la app en el emulador de Android |
| `npm run ios` | Abre la app en el simulador de iOS |
| `npm run web` | Abre la app en el navegador |
| `npm run lint` | Ejecuta ESLint |

## Licencia

Distribuido bajo la [Licencia MIT](LICENSE).
