import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { SafeAreaView } from "react-native-safe-area-context";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { obtenerHistorial, type RegistroRiego } from "../../servicios/datos";
import { colores, estilos, radios, sombras } from "../../../estilos";

function formatearFecha(iso: string): string {
  const fecha = new Date(iso);
  return fecha.toLocaleDateString("es-AR", {
    day: "2-digit",
    month: "short",
  });
}

function formatearHora(iso: string): string {
  const fecha = new Date(iso);
  return fecha.toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit" });
}

export default function Historial() {
  const [registros, setRegistros] = useState<RegistroRiego[]>([]);

  useFocusEffect(
    useCallback(() => {
      void obtenerHistorial().then(setRegistros);
    }, []),
  );

  const enCurso = registros.filter((r) => r.estado === "en_curso").length;
  const litrosTotales = registros.reduce((suma, r) => suma + r.litros, 0);

  return (
    <SafeAreaView style={estilos.fondo}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.contenido}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.cabecera}>
          <Text style={estilos.tituloDisplay}>Historial</Text>
          <Text style={estilos.cuerpo}>Tus riegos ejecutados y en curso</Text>
        </View>

        <View style={styles.tarjetaResumen}>
          <View style={styles.dato}>
            <Text style={estilos.metrica}>{`${registros.length}`}</Text>
            <Text style={styles.datoEtiqueta}>Riegos</Text>
          </View>
          <View style={styles.separadorResumen} />
          <View style={styles.dato}>
            <Text style={estilos.metrica}>{`${enCurso}`}</Text>
            <Text style={styles.datoEtiqueta}>En curso</Text>
          </View>
          <View style={styles.separadorResumen} />
          <View style={styles.dato}>
            <Text style={estilos.metrica}>{`${litrosTotales.toLocaleString("es-AR")}`}</Text>
            <Text style={styles.datoEtiqueta}>Litros totales</Text>
          </View>
        </View>

        {registros.length === 0 ? (
          <View style={styles.vacio}>
            <MaterialCommunityIcons name="calendar-sync" size={36} color={colores.borde} />
            <Text style={estilos.tituloHeadline}>Sin riegos todavía</Text>
            <Text style={styles.vacioTexto}>
              Cuando inicies un riego lo vas a ver acá con su duración y consumo.
            </Text>
            <Pressable style={styles.botonIr} onPress={() => router.push("/Sensores")}>
              <Text style={styles.botonIrTexto}>Ir a Sensores</Text>
            </Pressable>
          </View>
        ) : (
          registros.map((registro) => (
            <View key={registro.id} style={styles.tarjeta}>
              <View style={styles.tarjetaIzq}>
                <View style={styles.iconoRiego}>
                  <MaterialCommunityIcons name="water" size={22} color={colores.primario} />
                </View>
                <View style={{ flex: 1, minWidth: 0, gap: 2 }}>
                  <Text style={estilos.tituloHeadline} numberOfLines={1}>
                    {registro.lote.charAt(0) + registro.lote.slice(1).toLowerCase()}
                  </Text>
                  <Text style={styles.detalle} numberOfLines={1}>
                    {`${formatearFecha(registro.fecha)} • ${formatearHora(registro.fecha)}`}
                  </Text>
                </View>
              </View>
              <View style={styles.tarjetaDer}>
                <Text style={estilos.metrica}>{`${registro.litros} L`}</Text>
                <Text style={styles.detalle}>{`${registro.duracionMin} min`}</Text>
                <View
                  style={[
                    styles.badge,
                    registro.estado === "en_curso"
                      ? styles.badgeCurso
                      : styles.badgeListo,
                  ]}
                >
                  <Text
                    style={[
                      styles.badgeTexto,
                      registro.estado === "en_curso"
                        ? styles.badgeCursoTexto
                        : undefined,
                    ]}
                  >
                    {registro.estado === "en_curso" ? "EN CURSO" : "FINALIZADO"}
                  </Text>
                </View>
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1 },
  contenido: { paddingBottom: 120 },
  cabecera: {
    padding: 20,
    paddingBottom: 12,
    gap: 4,
  },
  tarjetaResumen: {
    marginHorizontal: 20,
    padding: 16,
    borderRadius: radios.xl,
    backgroundColor: colores.superficieContenedorMasBajo,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    ...sombras.nivel1,
  },
  dato: { alignItems: "center", gap: 2 },
  datoEtiqueta: {
    fontFamily: "Karla_500Medium",
    fontSize: 12,
    color: colores.sobreSuperficieVariante,
  },
  separadorResumen: {
    width: 1,
    height: 36,
    backgroundColor: colores.varianteSuperficie,
    borderRadius: radios.full,
  },
  tarjeta: {
    marginHorizontal: 20,
    marginTop: 12,
    padding: 14,
    borderRadius: radios.xl,
    backgroundColor: colores.superficieContenedorMasBajo,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
    ...sombras.nivel1,
  },
  tarjetaIzq: {
    flex: 1,
    minWidth: 0,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  iconoRiego: {
    width: 44,
    height: 44,
    borderRadius: radios.full,
    backgroundColor: colores.primarioFijo,
    alignItems: "center",
    justifyContent: "center",
  },
  detalle: {
    fontFamily: "Karla_400Regular",
    fontSize: 12,
    color: colores.sobreSuperficieVariante,
  },
  tarjetaDer: { alignItems: "flex-end", gap: 2 },
  badge: {
    borderRadius: radios.full,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginTop: 2,
  },
  badgeCurso: { backgroundColor: colores.badgeSuave },
  badgeListo: { backgroundColor: colores.superficieContenedorAlto },
  badgeTexto: {
    fontFamily: "Karla_700Bold",
    fontSize: 10,
    letterSpacing: 0.4,
    color: colores.sobreSuperficieVariante,
  },
  badgeCursoTexto: { color: colores.sobreBadge },
  vacio: {
    marginHorizontal: 20,
    marginTop: 24,
    padding: 28,
    gap: 8,
    alignItems: "center",
    borderRadius: radios["2xl"],
    backgroundColor: colores.superficieContenedorMasBajo,
    ...sombras.nivel1,
  },
  vacioTexto: {
    fontFamily: "Karla_400Regular",
    fontSize: 14,
    textAlign: "center",
    color: "#64748b",
  },
  botonIr: {
    marginTop: 8,
    backgroundColor: colores.primario,
    borderRadius: radios.full,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  botonIrTexto: {
    fontFamily: "Karla_700Bold",
    fontSize: 14,
    color: colores.sobrePrimario,
  },
});
