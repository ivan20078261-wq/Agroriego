import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Alert,
  Image,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import {
  guardarPerfil,
  obtenerLotes,
  obtenerPerfil,
  obtenerSensoresTotales,
  restablecerDatos,
  type Perfil as PerfilDatos,
} from "../../servicios/datos";
import { colores, estilos, radios, sombras } from "../../../estilos";

type NombreIcono = keyof typeof MaterialCommunityIcons.glyphMap;

type FilaMenu = {
  etiqueta: string;
  detalle: string;
  icono: NombreIcono;
  accion?: () => void;
};

type DatoFinca = { valor: string; etiqueta: string };

function FilasMenu({ titulo, filas }: { titulo: string; filas: FilaMenu[] }) {
  return (
    <View style={styles.seccion}>
      <Text style={styles.tituloSeccion}>{titulo}</Text>
      <View style={styles.tarjetaMenu}>
        {filas.map((fila) => (
          <Pressable
            key={fila.etiqueta}
            style={styles.filaMenu}
            onPress={fila.accion}
          >
            <View style={styles.iconoFila}>
              <MaterialCommunityIcons name={fila.icono} size={20} color={colores.primario} />
            </View>
            <View style={styles.textosFila}>
              <Text style={estilos.etiqueta}>{fila.etiqueta}</Text>
              <Text style={styles.detalleFila}>{fila.detalle}</Text>
            </View>
            <MaterialCommunityIcons
              name="chevron-right"
              size={20}
              color={colores.sobreSuperficieVariante}
            />
          </Pressable>
        ))}
      </View>
    </View>
  );
}

export default function Perfil() {
  const [perfil, setPerfil] = useState<PerfilDatos | null>(null);
  const [datos, setDatos] = useState<DatoFinca[]>([
    { valor: "0", etiqueta: "Lotes" },
    { valor: "0", etiqueta: "Sensores" },
    { valor: "0", etiqueta: "Hectáreas" },
  ]);
  const [editarVisible, setEditarVisible] = useState(false);
  const [seguridadVisible, setSeguridadVisible] = useState(false);
  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [telefono, setTelefono] = useState("");
  const [clave, setClave] = useState("");
  const [claveRepetida, setClaveRepetida] = useState("");

  const cargar = useCallback(async () => {
    setPerfil(await obtenerPerfil());
    const lotes = await obtenerLotes();
    const sensores = await obtenerSensoresTotales();
    const hectareas = lotes.reduce(
      (suma, l) => suma + (parseFloat(l.hectareas) || 0),
      0,
    );
    setDatos([
      { valor: `${lotes.length}`, etiqueta: "Lotes" },
      { valor: `${sensores}`, etiqueta: "Sensores" },
      { valor: hectareas.toFixed(1), etiqueta: "Hectáreas" },
    ]);
  }, []);

  useFocusEffect(
    useCallback(() => {
      void cargar();
    }, [cargar]),
  );

  const abrirEdicion = useCallback(async () => {
    const actual = await obtenerPerfil();
    setNombre(actual.nombre);
    setCorreo(actual.correo);
    setTelefono(actual.telefono);
    setEditarVisible(true);
  }, []);

  const guardarEdicion = useCallback(async () => {
    if (!nombre.trim() || !correo.trim()) {
      Alert.alert("Faltan datos", "El nombre y el correo son obligatorios.");
      return;
    }
    await guardarPerfil({
      nombre: nombre.trim(),
      correo: correo.trim(),
      telefono: telefono.trim(),
    });
    setEditarVisible(false);
    await cargar();
  }, [correo, cargar, nombre, telefono]);

  const cambiarClave = useCallback(() => {
    if (clave.length < 6) {
      Alert.alert("Contraseña corta", "Usá al menos 6 caracteres.");
      return;
    }
    if (clave !== claveRepetida) {
      Alert.alert("No coinciden", "Las contraseñas no coinciden.");
      return;
    }
    setSeguridadVisible(false);
    setClave("");
    setClaveRepetida("");
    Alert.alert("Listo", "Tu contraseña se actualizó correctamente.");
  }, [clave, claveRepetida]);

  const cerrarSesion = useCallback(() => {
    Alert.alert("Cerrar sesión", "¿Querés cerrar tu sesión?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Cerrar sesión",
        style: "destructive",
        onPress: () => {
          void restablecerDatos();
          router.replace("/");
        },
      },
    ]);
  }, []);

  return (
    <SafeAreaView style={estilos.fondo}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.contenido}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.tarjetaUsuario}>
          <Image
            source={{
              uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuA0Ix8YbYbs0Oblf6O-f0Z_P9O6jHahdMwaarfugoG4hFzOfKbC56Yrndmou-JxGvYso7P4vz2vfb4jd9Y91n5L3HA1Y1_kOG9lTO-Qx4FweH0Idr-8UdYO94w5jF2zqYV7BrsawuwQ3x2DJQdIbM1rglYXRM-11jUniuyW0ZZngfhUWTdoWKNl-YyOVAR1jzsxIFpC1gDo2r9IocxFfGDU5q46kODE5NkdY1fck644uR1HSZUFcZU",
            }}
            style={styles.avatar}
          />
          <Text style={estilos.tituloDisplay}>{perfil?.nombre ?? "AgroRiego"}</Text>
          <Text style={styles.correo}>{perfil?.correo ?? ""}</Text>
          {perfil?.telefono ? (
            <Text style={styles.correo}>{perfil.telefono}</Text>
          ) : null}
          <View style={styles.rol}>
            <MaterialCommunityIcons
              name="shield-account"
              size={14}
              color={colores.sobreContenedorSecundario}
            />
            <Text style={styles.rolTexto}>Administrador</Text>
          </View>
        </View>

        <View style={styles.tarjetaFinca}>
          <View style={styles.filaFincaCabecera}>
            <View style={styles.iconoFinca}>
              <MaterialCommunityIcons
                name="map-marker-radius"
                size={20}
                color={colores.sobreContenedorSecundario}
              />
            </View>
            <View style={styles.textosFila}>
              <Text style={estilos.tituloHeadline}>Finca Los Andes</Text>
              <Text style={styles.detalleFila}>Coquimbito, Maipú • Mendoza, Argentina</Text>
            </View>
          </View>
          <View style={styles.filaDatos}>
            {datos.map((dato) => (
              <View key={dato.etiqueta} style={styles.dato}>
                <Text style={estilos.metrica}>{dato.valor}</Text>
                <Text style={styles.etiquetaDato}>{dato.etiqueta}</Text>
              </View>
            ))}
          </View>
        </View>

        <FilasMenu
          titulo="Gestión"
          filas={[
            {
              etiqueta: "Nodos y Gateway",
              detalle: "Gateway Central • sensores en línea",
              icono: "access-point",
              accion: () => router.push("/Sensores"),
            },
            {
              etiqueta: "Válvulas y Turnos",
              detalle: "Programación y estado de turnos",
              icono: "water-pump",
              accion: () => router.push("/Sensores"),
            },
            {
              etiqueta: "Alertas de Humedad",
              detalle: "Lotes en alerta hídrica",
              icono: "bell-outline",
              accion: () => router.push("/Sensores"),
            },
            {
              etiqueta: "Reportes de Riego",
              detalle: "Riegos ejecutados y consumo",
              icono: "chart-line",
              accion: () => router.push("/Historial"),
            },
          ]}
        />

        <FilasMenu
          titulo="Cuenta"
          filas={[
            {
              etiqueta: "Perfil personal",
              detalle: "Nombre, correo y teléfono",
              icono: "account",
              accion: () => {
                void abrirEdicion();
              },
            },
            {
              etiqueta: "Seguridad",
              detalle: "Contraseña de la cuenta",
              icono: "shield-account",
              accion: () => setSeguridadVisible(true),
            },
          ]}
        />

        <Pressable style={styles.botonCerrar} onPress={cerrarSesion}>
          <MaterialCommunityIcons name="logout" size={20} color={colores.sobreContenedorError} />
          <Text style={styles.botonCerrarTexto}>Cerrar sesión</Text>
        </Pressable>

        <Text style={styles.version}>AgroRiego • v1.0.0</Text>
      </ScrollView>

      <Modal
        visible={editarVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setEditarVisible(false)}
      >
        <View style={styles.modalFondo}>
          <View style={styles.modalCaja}>
            <Text style={estilos.tituloHeadline}>Perfil personal</Text>
            <Text style={styles.modalSuave}>Editá tus datos de contacto</Text>
            <TextInput
              style={styles.entrada}
              value={nombre}
              onChangeText={setNombre}
              placeholder="Nombre completo"
              placeholderTextColor={colores.borde}
            />
            <TextInput
              style={styles.entrada}
              value={correo}
              onChangeText={setCorreo}
              placeholder="Correo"
              autoCapitalize="none"
              keyboardType="email-address"
              placeholderTextColor={colores.borde}
            />
            <TextInput
              style={styles.entrada}
              value={telefono}
              onChangeText={setTelefono}
              placeholder="Teléfono"
              keyboardType="phone-pad"
              placeholderTextColor={colores.borde}
            />
            <View style={styles.modalBotones}>
              <Pressable style={styles.botonCalma} onPress={() => setEditarVisible(false)}>
                <Text style={styles.botonCalmaTexto}>Cancelar</Text>
              </Pressable>
              <Pressable
                style={styles.botonAmbar}
                onPress={() => {
                  void guardarEdicion();
                }}
              >
                <Text style={styles.botonAmbarTexto}>Guardar</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        visible={seguridadVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setSeguridadVisible(false)}
      >
        <View style={styles.modalFondo}>
          <View style={styles.modalCaja}>
            <Text style={styles.modalTituloConIcono}>
              <MaterialCommunityIcons name="lock-outline" size={22} color={colores.primario} />
              {"  Cambiar contraseña"}
            </Text>
            <TextInput
              style={styles.entrada}
              value={clave}
              onChangeText={setClave}
              placeholder="Nueva contraseña"
              secureTextEntry
              placeholderTextColor={colores.borde}
            />
            <TextInput
              style={styles.entrada}
              value={claveRepetida}
              onChangeText={setClaveRepetida}
              placeholder="Repetir contraseña"
              secureTextEntry
              placeholderTextColor={colores.borde}
            />
            <View style={styles.modalBotones}>
              <Pressable style={styles.botonCalma} onPress={() => setSeguridadVisible(false)}>
                <Text style={styles.botonCalmaTexto}>Cancelar</Text>
              </Pressable>
              <Pressable style={styles.botonAmbar} onPress={cambiarClave}>
                <Text style={styles.botonAmbarTexto}>Actualizar</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1 },
  contenido: { paddingBottom: 120 },
  tarjetaUsuario: {
    alignItems: "center",
    gap: 6,
    paddingTop: 16,
    paddingBottom: 20,
  },
  avatar: { width: 96, height: 96, borderRadius: 48, marginBottom: 8 },
  correo: {
    fontFamily: "Karla_400Regular",
    fontSize: 14,
    color: colores.sobreSuperficieVariante,
  },
  rol: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 4,
    backgroundColor: colores.contenedorSecundario,
    borderRadius: radios.full,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  rolTexto: {
    fontFamily: "Karla_700Bold",
    fontSize: 12,
    color: colores.sobreContenedorSecundario,
  },
  tarjetaFinca: {
    marginHorizontal: 20,
    padding: 20,
    gap: 14,
    borderRadius: radios.xl,
    backgroundColor: colores.superficieContenedorMasBajo,
    ...sombras.nivel1,
  },
  filaFincaCabecera: { flexDirection: "row", alignItems: "center", gap: 12 },
  iconoFinca: {
    width: 44,
    height: 44,
    borderRadius: radios.full,
    backgroundColor: colores.contenedorSecundario,
    alignItems: "center",
    justifyContent: "center",
  },
  filaDatos: { flexDirection: "row", justifyContent: "space-around", gap: 8 },
  dato: { alignItems: "center", gap: 2 },
  etiquetaDato: {
    fontFamily: "Karla_500Medium",
    fontSize: 12,
    color: colores.sobreSuperficieVariante,
  },
  seccion: { marginTop: 20, marginHorizontal: 20, gap: 10 },
  tituloSeccion: { ...estilos.etiqueta, marginLeft: 4 },
  tarjetaMenu: {
    borderRadius: radios.xl,
    backgroundColor: colores.superficieContenedorMasBajo,
    ...sombras.nivel1,
  },
  filaMenu: { flexDirection: "row", alignItems: "center", gap: 12, padding: 14 },
  iconoFila: {
    width: 40,
    height: 40,
    borderRadius: radios.full,
    backgroundColor: colores.primarioFijo,
    alignItems: "center",
    justifyContent: "center",
  },
  textosFila: { flex: 1, minWidth: 0, gap: 2 },
  detalleFila: {
    fontFamily: "Karla_400Regular",
    fontSize: 12,
    color: colores.sobreSuperficieVariante,
  },
  botonCerrar: {
    marginHorizontal: 20,
    marginTop: 24,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: colores.contenedorError,
    borderRadius: radios.full,
    paddingVertical: 14,
  },
  botonCerrarTexto: {
    fontFamily: "Karla_700Bold",
    fontSize: 14,
    color: colores.sobreContenedorError,
  },
  version: {
    marginTop: 16,
    textAlign: "center",
    fontFamily: "Karla_400Regular",
    fontSize: 12,
    color: colores.borde,
  },
  modalFondo: {
    flex: 1,
    backgroundColor: "rgba(27,28,26,0.45)",
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  modalCaja: {
    width: "100%",
    padding: 20,
    borderRadius: radios["2xl"],
    backgroundColor: colores.superficieContenedorMasBajo,
    gap: 10,
    ...sombras.nivel2,
  },
  modalTituloConIcono: {
    fontFamily: "BricolageGrotesque_700Bold",
    fontSize: 18,
    color: colores.sobreFondo,
    flexDirection: "row",
  },
  modalSuave: { fontFamily: "Karla_400Regular", fontSize: 13, color: "#64748b" },
  entrada: {
    borderWidth: 1,
    borderColor: colores.bordeVariante,
    borderRadius: radios.lg,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontFamily: "Karla_400Regular",
    fontSize: 14,
    color: colores.sobreFondo,
    backgroundColor: colores.fondo,
  },
  modalBotones: { flexDirection: "row", justifyContent: "flex-end", gap: 8, marginTop: 6 },
  botonCalma: {
    borderRadius: radios.full,
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: colores.superficieContenedorAlto,
  },
  botonCalmaTexto: {
    fontFamily: "Karla_700Bold",
    fontSize: 14,
    color: colores.sobreSuperficieVariante,
  },
  botonAmbar: {
    borderRadius: radios.full,
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: colores.acentoAmbar,
  },
  botonAmbarTexto: {
    fontFamily: "Karla_700Bold",
    fontSize: 14,
    color: colores.sobrePrimario,
  },
});
