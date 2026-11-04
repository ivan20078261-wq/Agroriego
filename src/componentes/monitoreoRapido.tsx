import { View, Text, StyleSheet } from "react-native";
import { estilos, colores } from "../../estilos";

export default function MonitoreoRapido() {
  return (
    <View style={styles.contenedor}>
      <View style={styles.cabecera}>
        <View>
          <Text style={estilos.tituloHeadline}>Monitoreo Rápido</Text>
          <Text style={estilos.cuerpo}>
            Lecturas en tiempo real desde nodos LoRa
          </Text>
        </View>
      </View>

      <View style={styles.grid}>
        <View style={[estilos.card, styles.tarjeta]}>
          <View style={estilos.cardHeader}>
            <View style={estilos.badge}>
              <Text style={estilos.badgeTexto}>Normal</Text>
            </View>
          </View>
          <View style={styles.bloqueMetrica}>
            <Text style={estilos.etiqueta}>Humedad Suelo</Text>
            <View style={estilos.metricRow}>
              <Text style={estilos.metrica}>48.5</Text>
              <Text style={estilos.etiqueta}>%</Text>
            </View>
          </View>
          <View style={styles.barraContenedor}>
            <View style={estilos.progressTrack}>
              <View
                style={[
                  estilos.progressFill,
                  { width: "48.5%", backgroundColor: colores.terciario },
                ]}
              />
            </View>
            <View style={styles.barraPie}>
              <Text style={estilos.etiqueta}>Seco</Text>
              <Text
                style={[
                  estilos.etiqueta,
                  { color: colores.secundario, fontWeight: "700" },
                ]}
              >
                Óptimo
              </Text>
              <Text style={estilos.etiqueta}>Sat.</Text>
            </View>
          </View>
        </View>

        <View style={[estilos.card, styles.tarjeta]}>
          <View style={estilos.cardHeader}>
         
            <View
              style={[
                estilos.badge,
                { backgroundColor: colores.contenedorSecundario },
              ]}
            >
              <Text
                style={[
                  estilos.badgeTexto,
                  { color: colores.sobreContenedorSecundario },
                ]}
              >
                Detectado
              </Text>
            </View>
          </View>
          <View style={styles.bloqueMetrica}>
            <Text style={estilos.etiqueta}>Llegada de Agua</Text>
            <Text style={estilos.tituloHeadline}>Flujo Activo</Text>
            <Text style={estilos.etiqueta}>Presurización estable</Text>
          </View>
          <View
            style={[
              estilos.badge,
              {
                backgroundColor: colores.superficieContenedorBajo,
                alignSelf: "flex-start",
                marginTop: 8,
              },
            ]}
          >
            <Text
              style={[
                estilos.etiqueta,
                { color: colores.terciario, fontWeight: "700" },
              ]}
            >
              0.82 m/s
            </Text>
          </View>
        </View>

        <View style={[estilos.card, styles.tarjeta]}>
          <View style={estilos.cardHeader}>
        
            <View style={estilos.badge}>
              <Text style={estilos.badgeTexto}>Óptimo</Text>
            </View>
          </View>
          <View style={styles.bloqueMetrica}>
            <Text style={estilos.etiqueta}>Temp. en Raíz</Text>
            <View style={estilos.metricRow}>
              <Text style={estilos.metrica}>21.4</Text>
              <Text style={estilos.etiqueta}>°C</Text>
            </View>
          </View>
          <View style={styles.pieMetrica}>
            <Text style={estilos.etiqueta}>Ambiente: 28.1°C</Text>
            <Text
              style={[
                estilos.etiqueta,
                { color: colores.terciario, fontWeight: "700" },
              ]}
            >
              Δ 6.7°
            </Text>
          </View>
        </View>

        <View style={[estilos.card, styles.tarjeta]}>
          <View style={estilos.cardHeader}>
        
            <View style={estilos.badge}>
              <Text style={estilos.badgeTexto}>LoRaWAN</Text>
            </View>
          </View>
          <View style={styles.bloqueMetrica}>
            <Text style={estilos.etiqueta}>Batería Nodos</Text>
            <View style={estilos.metricRow}>
              <Text style={estilos.metrica}>94</Text>
              <Text style={estilos.etiqueta}>%</Text>
            </View>
          </View>
          <View style={styles.pieMetrica}>
            <Text style={estilos.etiqueta}>-82 dBm</Text>
            <Text
              style={[
                estilos.etiqueta,
                { color: colores.secundario, fontWeight: "700" },
              ]}
            >
              Excelente
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: { gap: 8 },
  cabecera: { gap: 2 },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  tarjeta: {
    width: "48%",
    minHeight: 150,
  },
  bloqueMetrica: { marginTop: 8, gap: 2 },
  barraContenedor: { marginTop: 8, gap: 4 },
  barraPie: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  pieMetrica: {
    marginTop: 8,
    flexDirection: "row",
    justifyContent: "space-between",
  },
});
