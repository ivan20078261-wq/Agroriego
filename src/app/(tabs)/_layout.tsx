import BarraNavegacion from "@/componentes/BarraNavegacion";
import { TabList, Tabs, TabSlot, TabTrigger } from "expo-router/ui";

export default function TabsLayout() {
  return (
    <Tabs style={{ flex: 1 }}>
      <TabSlot />
      <BarraNavegacion />
      {/* define las rutas, invisible */}
      <TabList style={{ display: "none" }}>
        <TabTrigger name="inicio" href="/" />
        <TabTrigger name="sensores" href="/Sensores" />
        <TabTrigger name="historial" href="/Historial" />
        <TabTrigger name="perfil" href="/Perfil" />
      </TabList>
    </Tabs>
  );
}
