import AsyncStorage from "@react-native-async-storage/async-storage";

export type EstadoLote = "riego" | "estres" | "programado";

export type Lote = {
  id: string;
  lote: string;
  tipo: string;
  hectareas: string;
  variedad: string;
  imagen: string;
  chip: string;
  estado: EstadoLote;
  humedad: number;
  caudal: number | null;
  sensorRaiz30: number;
  sensorRaiz60: number;
  turnoDetalle: string | null;
  riegoEnCurso: boolean;
};

export type RegistroRiego = {
  id: string;
  loteId: string;
  lote: string;
  fecha: string;
  duracionMin: number;
  litros: number;
  estado: "en_curso" | "finalizado";
};

export type Perfil = {
  nombre: string;
  correo: string;
  telefono: string;
};

type Almacenamiento = {
  lotes: Lote[];
  riegos: RegistroRiego[];
  sensoresTotales: number;
  perfil: Perfil;
};

const CLAVE = "agroriego:v1";

const IMAGENES = {
  malbec:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuAHFoVPSIh6_LO-360E9YyVEluJbwlU0QIBHrqVIsA0oALcyjFQTgp8o9Gyuk4xO1BIvm9E2nq53gwmvTdVpGyhk4mHLrGe91HIbix5JV_bliLggJwOOjrxcyJKtMZ30spPiZg4sOREloKDueLnmUE7wGzHu1Wr1z528vaF04pb-jW2Xc0BBo7_164JawPOIiRcCC7HA3XkS2dYFLaDU3aN9H731fKjVXdnmTAN9w",
  cabernet:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuD0kZjEvjAfkCFBJLmcaCmITK2hL4Qzvp0xIuBKb-D6739-DrbM74OW1mJfLtg3q2w-nKQA2JFqwCK_KL3N5F8uG9Hyy-Xe5zH5xoyadOMIM1P6ftBZcwo7gA0bDd4SV9q-W1OH5PuMELIXhUjFMcr25j6COjfa5H8u7DZ7IKdYlXpS3Y3GTfchUGkKP7LdkiuxOZCRfeJuU7zVz4EwJdmgMwS_FsGbeOSLsJ8LYg",
  torrontes:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuA-RhCP7ByKm19RRJZWi4GlmHp7mmUPkCE4dWBUCH_QTQ-xRnb71Nstsdvm6yHV1W5r7r3QJyh0skuw54BzrM3_cptIVjeIf6KG7-FVrbHxeOEn3ZMrdbYc7wHL_pZYsjG5Khhh0Z22HZt4jJBJLeRLda2xSOQgZdNPvvXmhiqQ5_zo4y_8cWFoJuV-_cKaHTECgBPtdfn7tvyKA7O_H17WDfvwFkA4kVala9YYRg",
};

function datosIniciales(): Almacenamiento {
  return {
    sensoresTotales: 12,
    perfil: {
      nombre: "José María",
      correo: "josemaria@fincaandes.com",
      telefono: "+54 9 261 400-1200",
    },
    riegos: [
      {
        id: "r-1",
        loteId: "lote-01",
        lote: "LOTE 01",
        fecha: "2026-11-02T06:00:00-03:00",
        duracionMin: 45,
        litros: 342,
        estado: "finalizado",
      },
      {
        id: "r-2",
        loteId: "lote-03",
        lote: "LOTE 03",
        fecha: "2026-11-01T22:00:00-03:00",
        duracionMin: 30,
        litros: 186,
        estado: "finalizado",
      },
    ],
    lotes: [
      {
        id: "lote-01",
        lote: "LOTE 01",
        tipo: "Espaldero",
        hectareas: "4.8 ha",
        variedad: "Malbec Gran Reserva",
        imagen: IMAGENES.malbec,
        chip: "Cuartel Norte • Suelo Franco-Arenoso",
        estado: "riego",
        humedad: 52,
        caudal: 12.8,
        sensorRaiz30: 54.2,
        sensorRaiz60: 49.8,
        turnoDetalle: null,
        riegoEnCurso: true,
      },
      {
        id: "lote-02",
        lote: "LOTE 02",
        tipo: "Parral",
        hectareas: "3.2 ha",
        variedad: "Cabernet Sauvignon",
        imagen: IMAGENES.cabernet,
        chip: "31.4°C Suelo • Sensor Raíz Seco",
        estado: "estres",
        humedad: 31,
        caudal: null,
        sensorRaiz30: 28.4,
        sensorRaiz60: 24.1,
        turnoDetalle: null,
        riegoEnCurso: false,
      },
      {
        id: "lote-03",
        lote: "LOTE 03",
        tipo: "Valle",
        hectareas: "5.1 ha",
        variedad: "Torrontés Riojano",
        imagen: IMAGENES.torrontes,
        chip: "Microclima Seco • Evapotranspiración Normal",
        estado: "programado",
        humedad: 46,
        caudal: 6.2,
        sensorRaiz30: 47.5,
        sensorRaiz60: 44.8,
        turnoDetalle: "Ciclo Nocturno • 22:00",
        riegoEnCurso: false,
      },
    ],
  };
}

let cache: Almacenamiento | null = null;

const temporizadores = new Map<string, ReturnType<typeof setTimeout>>();

async function almacen(): Promise<Almacenamiento> {
  if (!cache) {
    try {
      const crudo = await AsyncStorage.getItem(CLAVE);
      cache = crudo ? (JSON.parse(crudo) as Almacenamiento) : datosIniciales();
    } catch {
      cache = datosIniciales();
    }
  }
  return cache;
}

async function guardar(): Promise<void> {
  if (!cache) return;
  try {
    await AsyncStorage.setItem(CLAVE, JSON.stringify(cache));
  } catch {
    cache = null;
  }
}

export async function obtenerLotes(): Promise<Lote[]> {
  return (await almacen()).lotes;
}

export async function obtenerSensoresTotales(): Promise<number> {
  return (await almacen()).sensoresTotales;
}

export async function obtenerHistorial(): Promise<RegistroRiego[]> {
  return [...(await almacen()).riegos].sort((a, b) =>
    b.fecha.localeCompare(a.fecha),
  );
}

export async function obtenerPerfil(): Promise<Perfil> {
  return (await almacen()).perfil;
}

export async function iniciarRiego(
  loteId: string,
  minutos: number,
): Promise<void> {
  const datos = await almacen();
  const lote = datos.lotes.find((l) => l.id === loteId);
  if (!lote) return;
  if (lote.caudal === null) lote.caudal = 9.5;
  lote.estado = "riego";
  lote.riegoEnCurso = true;
  datos.riegos.unshift({
    id: `r-${Date.now()}`,
    loteId,
    lote: lote.lote,
    fecha: new Date().toISOString(),
    duracionMin: minutos,
    litros: Math.round(lote.caudal * minutos),
    estado: "en_curso",
  });
  temporizadores.set(
    loteId,
    setTimeout(() => {
      void detenerRiego(loteId);
    }, minutos * 60_000),
  );
  await guardar();
}

export async function detenerRiego(loteId: string): Promise<void> {
  const temporizador = temporizadores.get(loteId);
  if (temporizador) {
    clearTimeout(temporizador);
    temporizadores.delete(loteId);
  }
  const datos = await almacen();
  datos.riegos = datos.riegos.map((r) =>
    r.loteId === loteId && r.estado === "en_curso"
      ? { ...r, estado: "finalizado" as const }
      : r,
  );
  const lote = datos.lotes.find((l) => l.id === loteId);
  if (lote) {
    lote.riegoEnCurso = false;
    if (lote.estado === "riego") lote.estado = "programado";
    lote.turnoDetalle = "Detenido • Programar turno";
  }
  await guardar();
}

export async function programarTurno(
  loteId: string,
  detalle: string,
): Promise<void> {
  const datos = await almacen();
  const lote = datos.lotes.find((l) => l.id === loteId);
  if (!lote) return;
  lote.turnoDetalle = detalle;
  await guardar();
}

export async function vincularSensor(): Promise<void> {
  const datos = await almacen();
  datos.sensoresTotales += 1;
  await guardar();
}

export async function guardarPerfil(nuevo: Perfil): Promise<void> {
  const datos = await almacen();
  datos.perfil = nuevo;
  await guardar();
}

export async function obtenerSerie(loteId: string): Promise<number[]> {
  const semilla = [...loteId].reduce((suma, c) => suma + c.charCodeAt(0), 0);
  return Array.from({ length: 14 }, (_, i) => {
    const onda =
      45 +
      28 * Math.sin((i + semilla / 50) / 2.2) +
      ((semilla * (i + 7)) % 9);
    return Math.round(Math.max(12, Math.min(96, onda)) * 10) / 10;
  });
}

export async function restablecerDatos(): Promise<void> {
  temporizadores.forEach((t) => clearTimeout(t));
  temporizadores.clear();
  cache = datosIniciales();
  await guardar();
}
