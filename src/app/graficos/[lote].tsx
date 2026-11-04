import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { SafeAreaView } from "react-native-safe-area-context";
import { Dimensions, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import Svg, { Circle, Line, Polyline, Rect } from "react-native-svg";
import { router, useLocalSearchParams } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { obtenerLotes, obtenerSerie } from "../../servicios/datos";
import { colores, estilos, radios, sombras } from "../../../estilos";

const ANCHO = 320;
const ALTO = 180;
const MARGEN_X = 18;

function xPunto(indice: number, total: number): number {
  return MARGEN_X + (indice * (ANCHO - MARGEN_X * 2)) / (total - 1);
}

function yValor(porcentaje: number): number {
  return ALTO - 10 - porcentaje * 1.6;
}

export default function GraficosLote() {
  const { lote: loteId } = useLocalSearchParams<{ lote: string }>();
  const [titulo, setTitulo] = useState("Lote");
  const [serie, setSerie] = useState<number[]>([]);

  const cargar = useCallback(async () => {
    if (!loteId) return;
    const lotes = await obtenerLotes();
    const encontrado = lotes.find((l) => l.id === loteId);
    setTitulo(encontrado ? encontrado.variedad : "Lote");
    setSerie(await obtenerSerie(loteId));
  }, [loteId]);

  useEffect(() => {
    void cargar();
  }, [cargar]);

  const minimo = serie.length ? Math.min(...serie) : 0;
  const maximo = serie.length ? Math.max(...serie) : 0;
  const promedio = serie.length
    ? Math.round((serie.reduce((a, b) => a + b, 0) / serie.length) * 10) / 10
    : 0;

  const anchoPantalla = Dimensions.get("window").width - 40;
  const factor = anchoPantalla / ANCHO;

  return (
    <SafeAreaView style={estilos.fondo}>
      <ScrollView contentContainerStyle={styles.contenido} showsVerticalScrollIndicator={false}>
        <View style={styles.filaVolver}>
          <Pressable style={styles.botonVolver} onPress={() => router.back()}>
            <MaterialCommunityIcons name="arrow-left" size={22} color={colores.sobreFondo} />
          </Pressable>
          <Text style={estilos.tituloDisplay} numberOfLines={1}>
            {titulo}
          </Text>
        </View>

        <View style={styles.tarjeta}>
          <Text style={estilos.tituloHeadline}>Humedad de Suelo • 14 días</Text>

          {serie.length > 0 ? (
            <View style={styles.contenedorGrafico}>
              <Svg
                width={anchoPantalla}
                height={ALTO * factor}
                viewBox={`0 0 ${ANCHO} ${ALTO}`}
              >
                <Rect
                  x={MARGEN_X}
                  y={yValor(100)}
                  width={ANCHO - MARGEN_X * 2}
                  height={yValor(12) - yValor(100)}
                  fill={colores.superficieContenedorBajo}
                  rx={12}
                />
                <Line
                  x1={MARGEN_X}
                  x2={ANCHO - MARGEN_X}
                  y1={yValor(35)}
                  y2={yValor(35)}
                  stroke={colores.error}
                  strokeWidth={1.2}
                  strokeDasharray="4 4"
                  opacity={0.7}
                />
                <Polyline
                  points={serie.map((v, i) => `${xPunto(i, serie.length)},${yValor(v)}`).join(" ")}
                  fill="none"
                  stroke={colores.primario}
                  strokeWidth={2.5}
                  strokeLinejoin="round"
                  strokeLinecap="round"
                />
                {serie.map((v, i) => (
                  <Circle
                    key={`${i}-${v}`}
                    cx={xPunto(i, serie.length)}
                    cy={yValor(v)}
                    r={3}
                    fill={colores.superficieContenedorMasBajo}
                    stroke={colores.primario}
                    strokeWidth={1.6}
                  />
                ))}
              </Svg>
              <Text style={[styles.etiquetaSequia, { left: 8, top: (yValor(35) - 14) * factor }]}>
                35% crítico
              </Text>
              <Text style={[styles.etiquetaDia, { left: 8 }]}>Hace 14d</Text>
              <Text style={[styles.etiquetaDia, { right: 8 }]}>Hoy</Text>
            </View>
          ) : (
            <Text style={styles.textoSuave}>Sin lecturas disponibles</Text>
          )}

          <Text style={styles.notaGrafico}>
            Línea de riego óptimo por encima del 35% de humedad de raíz
          </Text>
        </View>

        <View style={styles.filaEstadisticas}>
          <View style={styles.fichaEstadistica}>
            <Text style={styles.textoSuave}>Mínimo</Text>
            <Text style={estilos.metrica}>{`${minimo}%`}</Text>
          </View>
          <View style={styles.fichaEstadistica}>
            <Text style={styles.textoSuave}>Máximo</Text>
            <Text style={estilos.metrica}>{`${maximo}%`}</Text>
          </View>
          <View style={styles.fichaEstadistica}>
            <Text style={styles.textoSuave}>Promedio</Text>
            <Text style={estilos.metrica}>{`${promedio}%`}</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  contenido: { paddingBottom: 40 },
  filaVolver: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  botonVolver: {
    width: 44,
    height: 44,
    borderRadius: radios.full,
    backgroundColor: colores.superficieContenedorMasBajo,
    alignItems: "center",
    justifyContent: "center",
    ...sombras.nivel1,
  },
  tarjeta: {
    marginHorizontal: 20,
    padding: 16,
    gap: 12,
    borderRadius: radios["2xl"],
    backgroundColor: colores.superficieContenedorMasBajo,
    ...sombras.nivel1,
  },
  contenedorGrafico: { position: "relative" },
  etiquetaSequia: {
    position: "absolute",
    fontFamily: "Karla_700Bold",
    fontSize: 10,
    color: colores.error,
  },
  etiquetaDia: {
    position: "absolute",
    bottom: 2,
    fontFamily: "Karla_500Medium",
    fontSize: 10,
    color: "#64748b",
  },
  notaGrafico: {
    fontFamily: "Karla_400Regular",
    fontSize: 12,
    color: "#64748b",
  },
  filaEstadisticas: { flexDirection: "row", gap: 8, marginHorizontal: 20, marginTop: 12 },
  fichaEstadistica: {
    flex: 1,
    padding: 12,
    borderRadius: radios.xl,
    backgroundColor: colores.superficieContenedorMasBajo,
    alignItems: "center",
    gap: 2,
    ...sombras.nivel1,
  },
  textoSuave: { fontFamily: "Karla_500Medium", fontSize: 12, color: "#64748b" },
});
