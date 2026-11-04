import { Calendario } from "@/componentes/Calendario";
import VerLotes from "@/componentes/monitorLotes";
import MonitoreoRapido from "@/componentes/monitoreoRapido";
import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { Image, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { obtenerLotes } from "../../servicios/datos";
import { colores, estilos, radios } from "../../../estilos";

export default function Index() {
  const [, setFechaSeleccionada] = useState<string>("");
  const [proximoTurno, setProximoTurno] = useState<{
    entidad: string;
    detalle: string;
  }>({ entidad: "Lote 02", detalle: "Mañana 06:00 AM" });

  useFocusEffect(
    useCallback(() => {
      void (async () => {
        const lotes = await obtenerLotes();
        const programado = lotes.find(
          (l) => l.estado === "programado" && l.turnoDetalle,
        );
        if (programado) {
          setProximoTurno({
            entidad: programado.lote.charAt(0) + programado.lote.slice(1).toLowerCase(),
            detalle: programado.turnoDetalle as string,
          });
        }
      })();
    }, []),
  );

  const fechasConRiego = ["2026-10-22"];

  const handleSelectDate = (fecha: string) => {
    setFechaSeleccionada(fecha);
    console.log("Fecha seleccionada:", fecha);
  };

  return (
    <SafeAreaView style={estilos.fondo}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContenido}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.contenido}>
          <View style={styles.saludoFila}>
            <View style={styles.saludoTexto}>
              <Text style={estilos.tituloDisplay}>¡Hola, José María!</Text>
              <Text style={estilos.cuerpo}>
                Riego programado en curso • Suelo hidratado
              </Text>
            </View>
            <View style={styles.avatarGrande}>
              <Image
                source={{
                  uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuA0Ix8YbYbs0Oblf6O-f0Z_P9O6jHahdMwaarfugoG4hFzOfKbC56Yrndmou-JxGvYso7P4vz2vfb4jd9Y91n5L3HA1Y1_kOG9lTO-Qx4FweH0Idr-8UdYO94w5jF2zqYV7BrsawuwQ3x2DJQdIbM1rglYXRM-11jUniuyW0ZZngfhUWTdoWKNl-YyOVAR1jzsxIFpC1gDo2r9IocxFfGDU5q46kODE5NkdY1fck644uR1HSZUFcZU",
                }}
                style={styles.avatarImg}
              />
            </View>
          </View>

          <Calendario
            fechasConEventos={fechasConRiego}
            onSelectDate={handleSelectDate}
          />

          <VerLotes />
          <MonitoreoRapido />

          <View style={estilos.card}>
            <Text style={estilos.tituloHeadline}>Próximo Turno de Riego</Text>
            <Text style={estilos.etiqueta}>
              {`${proximoTurno.entidad} • ${proximoTurno.detalle}`}
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1 },
  scrollContenido: { paddingBottom: 120 },
  contenido: {
    paddingHorizontal: 16,
    paddingTop: 16,
    gap: 16,
  },
  saludoFila: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  saludoTexto: { flex: 1, gap: 4 },
  avatarGrande: { position: "relative" },
  avatarImg: {
    width: 56,
    height: 56,
    borderRadius: 28,
  },
  banner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    borderLeftWidth: 4,
    borderLeftColor: colores.primario,
  },
  bannerAcento: {
    width: 4,
    alignSelf: "stretch",
    borderRadius: radios.sm,
    backgroundColor: colores.primario,
  },
  bannerContenido: { flex: 1, gap: 2 },
  bannerAccion: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: radios.full,
    backgroundColor: colores.primario,
  },
});
