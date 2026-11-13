import { Pressable, Text, StyleSheet, View } from "react-native";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { router } from "expo-router";
import { TabTrigger, TabTriggerSlotProps } from "expo-router/ui";
import type { ComponentProps } from "react";
import { estilos, colores } from "../../estilos";

type TabBotonProps = Omit<TabTriggerSlotProps, "ref"> &
  ComponentProps<typeof Pressable> & {
    etiqueta: string;
    icono: string;
  };

function TabBoton({ etiqueta, icono, isFocused, ...props }: TabBotonProps) {
  return (
    <Pressable {...props} style={[styles.tab, isFocused && styles.tabActivo]}>
      <FontAwesome6
        name={icono}
        size={18}
        color={isFocused ? colores.sobrePrimarioFijo : colores.sobreSuperficieVariante}
      />
      <Text style={[estilos.etiqueta, styles.etiquetaTab, isFocused && styles.etiquetaActiva]}>
        {etiqueta}
      </Text>
    </Pressable>
  );
}

export default function BarraNavegacion() {
  const tabs = [
    { name: "inicio", etiqueta: "Inicio", icono: "house" },
    { name: "sensores", etiqueta: "Sensores", icono: "microchip" },
    { name: "historial", etiqueta: "Historial", icono: "clock-rotate-left" },
    { name: "perfil", etiqueta: "Perfil", icono: "user" },
  ] as const;

  return (
    <View style={estilos.bottomNav}>
      {tabs.slice(0, 2).map((t) => (
        <TabTrigger key={t.name} name={t.name} asChild>
          <TabBoton etiqueta={t.etiqueta} icono={t.icono} />
        </TabTrigger>
      ))}

      <Pressable style={estilos.fab} onPress={() => router.push("/Sensores")}>
        <Text
          style={{
            color: colores.sobrePrimario,
            fontSize: 26,
            fontWeight: "700",
            lineHeight: 30,
            includeFontPadding: false,
            textAlign: "center",
          }}
        >
          +
        </Text>
      </Pressable>

      {tabs.slice(2).map((t) => (
        <TabTrigger key={t.name} name={t.name} asChild>
          <TabBoton etiqueta={t.etiqueta} icono={t.icono} />
        </TabTrigger>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  tab: {
    alignItems: "center",
    justifyContent: "center",
    width: 72,
    height: 56,
    borderRadius: 9999,
    gap: 2,
  },
  tabActivo: {
    backgroundColor: colores.primarioFijo,
  },
  etiquetaActiva: {
    color: colores.sobrePrimarioFijo,
  },
  etiquetaTab: {
    fontSize: 11,
    letterSpacing: 0.2,
  },
});
