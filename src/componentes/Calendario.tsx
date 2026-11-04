import React, { useMemo, useState } from "react";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";

export interface DayItem {
  date: string; // Formato ISO 'YYYY-MM-DD'
  dayName: string; // 'HOY', 'Mar', 'Mié', etc.
  dayNumber: number; // Número del día
  isToday: boolean;
  hasEvent?: boolean; // Para mostrar el punto de riego/evento
}

// Genera los días partiendo desde la fecha actual
function generarDiasDesdeHoy(cantidadDias: number = 15): DayItem[] {
  const hoy = new Date();
  const hoyISO = hoy.toISOString().split("T")[0];

  const dias: DayItem[] = [];

  for (let i = 0; i < cantidadDias; i++) {
    const fecha = new Date(hoy);
    fecha.setDate(hoy.getDate() + i);

    const fechaISO = fecha.toISOString().split("T")[0];
    const esHoy = fechaISO === hoyISO;

    let nombreDia = fecha.toLocaleDateString("es-ES", { weekday: "short" });
    nombreDia = nombreDia.replace(".", "");
    nombreDia = nombreDia.charAt(0).toUpperCase() + nombreDia.slice(1);

    dias.push({
      date: fechaISO,
      dayName: esHoy ? "HOY" : nombreDia,
      dayNumber: fecha.getDate(),
      isToday: esHoy,
      hasEvent: false,
    });
  }

  return dias;
}

interface CalendarioProps {
  onSelectDate?: (fecha: string) => void;
  fechasConEventos?: string[]; // Fechas con punto indicador
}

export function Calendario({
  onSelectDate,
  fechasConEventos = [],
}: CalendarioProps) {
  // Genera los días iniciando desde hoy
  const dias = useMemo(() => {
    const listaDias = generarDiasDesdeHoy(7);
    return listaDias.map((dia) => ({
      ...dia,
      hasEvent: fechasConEventos.includes(dia.date),
    }));
  }, [fechasConEventos]);

  // 'HOY' queda seleccionado automáticamente de inicio
  const [fechaSeleccionada, setFechaSeleccionada] = useState<string>(
    () => dias.find((d) => d.isToday)?.date || dias[0].date,
  );

  const handleSelect = (item: DayItem) => {
    setFechaSeleccionada(item.date);
    if (onSelectDate) {
      onSelectDate(item.date);
    }
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={dias}
        keyExtractor={(item) => item.date}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => {
          const isSelected = fechaSeleccionada === item.date;

          return (
            <Pressable
              onPress={() => handleSelect(item)}
              style={[
                styles.card,
                isSelected ? styles.selectedCard : styles.unselectedCard,
              ]}
            >
              <Text
                style={[
                  styles.dayName,
                  isSelected ? styles.selectedText : styles.unselectedText,
                ]}
              >
                {item.dayName}
              </Text>

              <Text
                style={[
                  styles.dayNumber,
                  isSelected ? styles.selectedText : styles.unselectedText,
                ]}
              >
                {item.dayNumber}
              </Text>

              <View style={styles.dotContainer}>
                {item.hasEvent && (
                  <View
                    style={[
                      styles.dot,
                      isSelected ? styles.selectedDot : styles.unselectedDot,
                    ]}
                  />
                )}
              </View>
            </Pressable>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 12,
  },
  listContent: {
    paddingHorizontal: 10,
    gap: 10,
    alignItems: "center",
  },
  card: {
    width: 74,
    height: 92,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 10,
  },
  unselectedCard: {
    backgroundColor: "#FFFFFF",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  selectedCard: {
    backgroundColor: "#FFF5D6", // Tono crema destacado de "HOY"
    borderWidth: 1.5,
    borderColor: "#E6C687",
    elevation: 4,
    shadowColor: "#B8860B",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    transform: [{ scale: 1.05 }],
  },
  dayName: {
    fontSize: 12,
    fontWeight: "600",
    marginBottom: 4,
  },
  dayNumber: {
    fontSize: 20,
    fontWeight: "700",
  },
  unselectedText: {
    color: "#4A5568",
  },
  selectedText: {
    color: "#8B4513",
  },
  dotContainer: {
    height: 10,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 4,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  selectedDot: {
    backgroundColor: "#8B4513",
  },
  unselectedDot: {
    backgroundColor: "#A0AEC0",
  },
});
