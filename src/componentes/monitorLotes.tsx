import { View, Text, StyleSheet, Pressable } from "react-native";
import Svg, { Path } from "react-native-svg";
import { router } from "expo-router";
import { estilos, colores } from "../../estilos";

export default function VerLotes() {
  return (
    <View style={styles.contenedor}>
      <View style={styles.cabecera}>
        <View style={styles.tituloFila}>
          <Text style={estilos.tituloHeadline}>Mis Lotes</Text>
        </View>
        <Pressable onPress={() => router.push("/Sensores")}>
          <Text style={estilos.etiqueta}>Ver todos</Text>
        </Pressable>
      </View>

      <View style={styles.fila}>
        <View style={[estilos.card, styles.lotePrincipal]}>
          <View style={styles.bloqueTitulo}>
            <Text style={estilos.tituloHeadline}>Lote 04 • Malbec</Text>
            <Text style={estilos.etiqueta}>Finca Beta, Mendoza • Goteo</Text>
          </View>

          <View style={styles.graficoContenedor}>
            <View style={styles.graficoCabecera}>
              <Text style={[estilos.etiqueta, { color: colores.secundario }]}>
                Flujo dinámico
              </Text>
              <Text style={estilos.etiqueta}>Estable ±0.2 L/m</Text>
            </View>
            <View style={styles.graficoPie}>
              <Text
                style={[
                  estilos.etiqueta,
                  { color: colores.terciario, fontWeight: "700" },
                ]}
              >
                Ahora
              </Text>
            </View>
          </View>

          <View style={styles.metricaFila}>
            <View>
              <Text style={estilos.etiqueta}>Caudal Actual</Text>
              <View style={estilos.metricRow}>
                <Text style={estilos.metrica}>14.2</Text>
                <Text style={estilos.etiqueta}>L/min</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={[estilos.card, styles.loteSecundario]}>
          <View style={styles.cabeceraSecundaria}>
        
            <Text style={estilos.etiqueta}>Válvula A2</Text>
          </View>

          <View style={styles.gaugeContenedor}>
            <Svg width={120} height={72} viewBox="0 0 100 100">
              <Path
                d="M 15 65 A 35 35 0 1 1 85 65"
                fill="none"
                stroke={colores.superficieContenedorAlto}
                strokeWidth={7}
                strokeLinecap="round"
              />
              <Path
                d="M 15 65 A 35 35 0 0 1 76 34"
                fill="none"
                stroke={colores.secundario}
                strokeWidth={7}
                strokeLinecap="round"
              />
            </Svg>
            <View style={styles.gaugeCentro}>
              <Text style={estilos.metrica}>2.4</Text>
              <Text style={estilos.etiqueta}>Bar</Text>
            </View>
          </View>

          <View style={styles.estadoFila}>
            <View style={estilos.badge}>
              <Text style={estilos.badgeTexto}>ABIERTA</Text>
            </View>
            <View
              style={[
                estilos.badge,
                { backgroundColor: colores.superficieContenedorBajo },
              ]}
            >
              <Text
                style={[
                  estilos.badgeTexto,
                  { color: colores.sobreSuperficieVariante },
                ]}
              >
                Óptimo
              </Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: { gap: 8 },
  cabecera: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  tituloFila: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  fila: {
    flexDirection: "row",
    gap: 12,
    alignItems: "stretch",
  },
  lotePrincipal: {
    flex: 3,
    minHeight: 260,
  },
  loteSecundario: {
    flex: 2,
    alignItems: "center",
    minHeight: 260,
  },
  bloqueTitulo: { gap: 2, marginTop: 8 },
  progresoCirculo: {
    width: 56,
    height: 56,
    alignItems: "center",
    justifyContent: "center",
  },
  progresoTexto: {
    position: "absolute",
    fontFamily: "BricolageGrotesque_700Bold",
    fontSize: 10,
    color: colores.terciario,
    fontWeight: "700",
  },
  graficoContenedor: { marginTop: 8, gap: 4 },
  graficoCabecera: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  graficoPie: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  metricaFila: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 8,
  },
  cabeceraSecundaria: {
    alignItems: "center",
    gap: 6,
  },
  gaugeContenedor: {
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 8,
  },
  gaugeCentro: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 8,
    alignItems: "center",
  },
  estadoFila: {
    flexDirection: "row",
    gap: 6,
    flexWrap: "wrap",
    justifyContent: "center",
  },
});
