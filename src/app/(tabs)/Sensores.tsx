import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Alert,
  Animated,
  Easing,
  Image,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import Svg, { Circle } from "react-native-svg";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import {
  detenerRiego,
  iniciarRiego,
  obtenerLotes,
  obtenerSensoresTotales,
  programarTurno,
  vincularSensor,
  type Lote,
  type EstadoLote,
} from "../../servicios/datos";
import { colores, estilos, radios, sombras } from "../../../estilos";

type NombreIcono = keyof typeof MaterialCommunityIcons.glyphMap;

const etiquetaEstado: Record<
  EstadoLote,
  {
    fondo: string;
    texto: string;
    icono: NombreIcono;
    colorIcono: string;
    colorTexto: string;
    girante?: boolean;
  }
> = {
  riego: {
    fondo: colores.badgeSuave,
    texto: "REGANDO",
    icono: "water",
    colorIcono: colores.acentoOliva,
    colorTexto: colores.sobreBadge,
    girante: true,
  },
  estres: {
    fondo: colores.contenedorError,
    texto: "ESTRÉS HÍDRICO",
    icono: "alert-circle",
    colorIcono: colores.error,
    colorTexto: colores.sobreContenedorError,
  },
  programado: {
    fondo: colores.superficieContenedorAlto,
    texto: "PROGRAMADO",
    icono: "clock-outline",
    colorIcono: colores.primario,
    colorTexto: colores.sobreSuperficieVariante,
  },
};

function IconoGirante({ children }: { children: ReactNode }) {
  const rotacion = useMemo(() => new Animated.Value(0), []);

  useEffect(() => {
    const animacion = Animated.loop(
      Animated.timing(rotacion, {
        toValue: 360,
        duration: 3000,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    );
    animacion.start();
    return () => animacion.stop();
  }, [rotacion]);

  return (
    <Animated.View
      style={{
        transform: [
          { rotate: rotacion.interpolate({ inputRange: [0, 360], outputRange: ["0deg", "360deg"] }) },
        ],
      }}
    >
      {children}
    </Animated.View>
  );
}

function PastillaEstado({ estado }: { estado: EstadoLote }) {
  const info = etiquetaEstado[estado];
  return (
    <View style={[styles.pastilla, { backgroundColor: info.fondo }]}>
      {info.girante ? (
        <IconoGirante>
          <MaterialCommunityIcons name={info.icono} size={16} color={info.colorIcono} />
        </IconoGirante>
      ) : (
        <MaterialCommunityIcons name={info.icono} size={16} color={info.colorIcono} />
      )}
      <Text style={[styles.pastillaTexto, { color: info.colorTexto }]}>{info.texto}</Text>
    </View>
  );
}

function Barra({ progreso, color }: { progreso: number; color: string }) {
  return (
    <View style={styles.barraFondo}>
      <View style={[styles.barraLleno, { width: `${progreso}%`, backgroundColor: color }]} />
    </View>
  );
}

function Ficha({
  etiqueta,
  icono,
  colorIcono,
  punto,
  valor,
  unidad,
  nota,
  colorNota,
  progreso,
  colorProgreso,
}: {
  etiqueta: string;
  icono?: NombreIcono;
  colorIcono?: string;
  punto?: string;
  valor: string;
  unidad?: string;
  nota?: string;
  colorNota?: string;
  progreso?: number;
  colorProgreso?: string;
}) {
  return (
    <View style={styles.ficha}>
      <View style={styles.fichaFila}>
        <Text style={styles.textoSuave}>{etiqueta}</Text>
        {punto ? (
          <View style={[styles.puntoEstado, { backgroundColor: punto }]} />
        ) : icono ? (
          <MaterialCommunityIcons name={icono} size={18} color={colorIcono} />
        ) : null}
      </View>
      <View style={styles.filaBaseAlta}>
        <Text style={styles.valorFicha}>{valor}</Text>
        {unidad ? <Text style={styles.unidadFicha}>{unidad}</Text> : null}
        {nota ? (
          <Text style={[estilos.etiqueta, styles.notaFicha, { color: colorNota }]}>{nota}</Text>
        ) : null}
      </View>
      {progreso !== undefined && colorProgreso ? (
        <Barra progreso={progreso} color={colorProgreso} />
      ) : null}
    </View>
  );
}

function AnilloAgua({ porcentaje, color }: { porcentaje: number; color: string }) {
  return (
    <View style={styles.anillo}>
      <Svg width={56} height={56} viewBox="0 0 36 36" style={styles.anilloGiro}>
        <Circle
          cx="18"
          cy="18"
          r="15.9155"
          fill="none"
          stroke={colores.varianteSuperficie}
          strokeWidth={3.5}
        />
        <Circle
          cx="18"
          cy="18"
          r="15.9155"
          fill="none"
          stroke={color}
          strokeWidth={3.5}
          strokeDasharray={`${porcentaje} 100`}
          strokeLinecap="round"
        />
      </Svg>
      <Text style={[styles.anilloTexto, { color }]}>{`${porcentaje}%`}</Text>
    </View>
  );
}

function CabeceraTarjeta({ lote }: { lote: Lote }) {
  return (
    <View style={styles.tarjetaCabecera}>
      <View style={styles.tarjetaTitulos}>
        <View style={styles.filaMeta}>
          <Text style={styles.metaLote}>{lote.lote}</Text>
          <View style={styles.puntoSeparador} />
          <Text style={styles.metaSuave}>{`${lote.tipo} • ${lote.hectareas}`}</Text>
        </View>
        <Text style={styles.variedad}>{lote.variedad}</Text>
      </View>
      <PastillaEstado estado={lote.estado} />
    </View>
  );
}

function ImagenTarjeta({ lote }: { lote: Lote }) {
  const iconosChip: Record<EstadoLote, NombreIcono> = {
    riego: "image-filter-hdr",
    estres: "thermometer",
    programado: "water-percent",
  };
  return (
    <View style={styles.contenedorImagen}>
      <Image source={{ uri: lote.imagen }} style={styles.imagen} />
      <View style={styles.veloImagen}>
        <View style={styles.chipImagen}>
          <MaterialCommunityIcons name={iconosChip[lote.estado]} size={14} color={colores.sobrePrimario} />
          <Text style={styles.chipImagenTexto}>{lote.chip}</Text>
        </View>
      </View>
    </View>
  );
}

type BotonFicha = {
  texto: string;
  icono: NombreIcono;
  onPress: () => void;
  variante?: "calma" | "ambar" | "peligro";
};

function PieTarjeta({ izquierda, botones }: { izquierda: ReactNode; botones: BotonFicha[] }) {
  return (
    <View style={{ gap: 8, paddingTop: 6 }}>
      <View style={styles.pieTarjeta}>{izquierda}</View>
      <View style={styles.filaBotones}>
        {botones.map((boton) => (
          <Pressable
            key={boton.texto}
            onPress={boton.onPress}
            style={[
              styles.botonFicha,
              boton.variante === "ambar" && styles.botonFichaAmbar,
              boton.variante === "peligro" && styles.botonFichaPeligro,
            ]}
          >
            <MaterialCommunityIcons
              name={boton.icono}
              size={18}
              color={
                boton.variante === "ambar" || boton.variante === "peligro"
                  ? colores.sobrePrimario
                  : colores.primario
              }
            />
            <Text
              style={
                boton.variante === "ambar" || boton.variante === "peligro"
                  ? styles.botonFichaClaroTexto
                  : undefined
              }
            >
              {boton.texto}
            </Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

function CuerpoRiego({ lote, onPressGraficos, onPressRiego }: { lote: Lote; onPressGraficos: () => void; onPressRiego: () => void }) {
  const optimo = lote.humedad >= 45;
  const botones: BotonFicha[] = [
    { texto: "Ver Gráficos", icono: "chart-line", onPress: onPressGraficos },
  ];
  if (lote.riegoEnCurso) {
    botones.push({ texto: "Detener Riego", icono: "stop-circle", onPress: onPressRiego, variante: "peligro" });
  }
  return (
    <View style={styles.cuerpo}>
      <View style={styles.filaFichas}>
        <Ficha
          etiqueta="Humedad Media"
          icono="leaf"
          colorIcono={colores.acentoOliva}
          valor={`${lote.humedad}%`}
          nota={optimo ? "Óptimo" : "Baja"}
          colorNota={optimo ? colores.acentoOliva : colores.error}
          progreso={lote.humedad}
          colorProgreso={optimo ? colores.acentoOliva : colores.error}
        />
        <Ficha
          etiqueta="Válvula 01"
          punto={lote.riegoEnCurso ? colores.acentoOliva : colores.borde}
          valor={lote.caudal !== null ? lote.caudal.toFixed(1) : "0"}
          unidad="L/min"
          nota={lote.riegoEnCurso ? "Abierta" : "En espera"}
          colorNota={colores.sobreSuperficieVariante}
        />
      </View>
      <View style={styles.panelRaiz}>
        <View style={styles.filaJustificada}>
          <View style={styles.filaChips}>
            <MaterialCommunityIcons name="water-percent" size={16} color={colores.acentoTierra} />
            <Text style={styles.textoSuave}>Sensor Raíz 30cm</Text>
          </View>
          <Text style={styles.valoresRaiz}>{`${lote.sensorRaiz30}%`}</Text>
        </View>
        <Barra progreso={lote.sensorRaiz30} color={colores.secundarioFijoAtenuado} />
        <View style={styles.filaJustificada}>
          <View style={styles.filaChips}>
            <MaterialCommunityIcons name="layers" size={16} color={colores.acentoTierra} />
            <Text style={styles.textoSuave}>Sensor Raíz 60cm</Text>
          </View>
          <Text style={styles.valoresRaiz}>{`${lote.sensorRaiz60}%`}</Text>
        </View>
        <Barra progreso={lote.sensorRaiz60} color={colores.secundarioFijoAtenuado} />
      </View>
      <PieTarjeta
        izquierda={
          <View style={styles.filaChips}>
            <MaterialCommunityIcons name="battery-charging-100" size={16} />
            <Text>98%</Text>
            <Text style={styles.pieSeparador}>•</Text>
            <MaterialCommunityIcons name="signal-cellular-3" size={16} />
            <Text>-78 dBm</Text>
          </View>
        }
        botones={botones}
      />
    </View>
  );
}

function CuerpoEstres({ lote, onPressGraficos, onPressRiego }: { lote: Lote; onPressGraficos: () => void; onPressRiego: () => void }) {
  const critico = lote.humedad < 35;
  return (
    <View style={styles.cuerpo}>
      <View style={styles.panelBulbo}>
        <View style={{ flex: 1, minWidth: 0 }}>
          <Text style={styles.textoSuave}>Humedad en Bulbo</Text>
          <View style={styles.filaBaseAlta}>
            <Text style={[styles.valorFicha, critico ? { color: colores.error } : undefined]}>
              {`${lote.humedad}%`}
            </Text>
            <Text style={[estilos.etiqueta, { fontSize: 12, color: critico ? colores.error : colores.sobreSuperficieVariante }]}>
              {critico ? "Nivel Crítico (<35%)" : "Nivel Bajo"}
            </Text>
          </View>
        </View>
        <AnilloAgua porcentaje={Math.min(lote.humedad, 100)} color={critico ? colores.error : colores.primario} />
      </View>
      <View style={styles.panelAgro}>
        <View style={styles.agroIcono}>
          <MaterialCommunityIcons name="brain" size={18} color={colores.sobrePrimario} />
        </View>
        <View style={styles.agroContenido}>
          <View style={styles.filaJustificada}>
            <Text style={styles.agroTitulo}>Recomendación AgroIA</Text>
            <View style={styles.pillUrgente}>
              <Text style={styles.pillUrgenteTexto}>Urgente</Text>
            </View>
          </View>
          <Text style={styles.agroTexto}>
            Estrés hídrico detectado en cuajado de racimos. Aplicar pulso hídrico
            inmediato para mitigar pérdida de calibre antes del mediodía.
          </Text>
        </View>
      </View>
      <Pressable style={styles.botonRiego} onPress={onPressRiego}>
        <MaterialCommunityIcons name="play-circle" size={20} color={colores.sobrePrimario} />
        <Text style={styles.botonRiegoTexto}>Iniciar Riego 45m</Text>
      </Pressable>
      <PieTarjeta
        izquierda={
          <View style={styles.filaChips}>
            <MaterialCommunityIcons name="battery-80" size={16} />
            <Text style={styles.textoSuave}>84% Batería</Text>
          </View>
        }
        botones={[{ texto: "Ver Gráficos", icono: "chart-line", onPress: onPressGraficos }]}
      />
    </View>
  );
}

function CuerpoProgramado({ lote, onPressGraficos, onPressTurno }: { lote: Lote; onPressGraficos: () => void; onPressTurno: () => void }) {
  const partes = (lote.turnoDetalle ?? "").split("•");
  const nota = (partes[0] ?? "").trim();
  const valor = partes[1] ? partes[1].trim() : "—";
  return (
    <View style={styles.cuerpo}>
      <View style={styles.filaFichas}>
        <Ficha
          etiqueta="Humedad Suelo"
          icono="water"
          colorIcono={colores.primario}
          valor={`${lote.humedad}%`}
          nota="Normal"
          colorNota={colores.sobreSuperficieVariante}
          progreso={lote.humedad}
          colorProgreso={colores.primario}
        />
        <Ficha
          etiqueta="Próximo Turno"
          valor={valor}
          nota={nota || "Sin programar"}
          colorNota={colores.sobreSuperficieVariante}
        />
      </View>
      <PieTarjeta
        izquierda={
          <View style={styles.filaChips}>
            <MaterialCommunityIcons name="battery-90" size={16} />
            <Text style={styles.textoSuave}>Batería nodo: </Text>
            <Text style={estilos.etiqueta}>96%</Text>
          </View>
        }
        botones={[
          { texto: "Ver Gráficos", icono: "chart-line", onPress: onPressGraficos },
          { texto: "Configurar Turno", icono: "tune-variant", onPress: onPressTurno },
        ]}
      />
    </View>
  );
}

type ChipInfo = { id: "todos" | "riego" | "alerta"; texto: string; punto?: string };

export default function Sensores() {
  const [chipActivo, setChipActivo] = useState<ChipInfo["id"]>("todos");
  const [listaLotes, setListaLotes] = useState<Lote[]>([]);
  const [totalSensores, setTotalSensores] = useState(12);
  const [loteTurno, setLoteTurno] = useState<Lote | null>(null);
  const [horarioTurno, setHorarioTurno] = useState("");
  const [vincularVisible, setVincularVisible] = useState(false);
  const [codigoSensor, setCodigoSensor] = useState("");

  const refrescar = useCallback(async () => {
    setListaLotes(await obtenerLotes());
    setTotalSensores(await obtenerSensoresTotales());
  }, []);

  useFocusEffect(
    useCallback(() => {
      void refrescar();
    }, [refrescar]),
  );

  const filtros: ChipInfo[] = [
    { id: "todos", texto: `Todos (${listaLotes.length})` },
    {
      id: "riego",
      texto: `En Riego (${listaLotes.filter((l) => l.estado === "riego").length})`,
      punto: colores.acentoOliva,
    },
    {
      id: "alerta",
      texto: `Alerta Humedad (${listaLotes.filter((l) => l.estado === "estres").length})`,
      punto: colores.error,
    },
  ];

  const estadoFiltro = chipActivo === "todos" ? null : chipActivo === "riego" ? "riego" : "estres";
  const visibles = estadoFiltro ? listaLotes.filter((l) => l.estado === estadoFiltro) : listaLotes;

  const accionRiego = useCallback(
    async (lote: Lote) => {
      if (lote.riegoEnCurso) {
        await detenerRiego(lote.id);
      } else {
        await iniciarRiego(lote.id, 45);
      }
      await refrescar();
    },
    [refrescar],
  );

  const guardarTurno = useCallback(async () => {
    if (loteTurno) {
      const detalle = horarioTurno.trim() || "Mañana 06:00 AM";
      await programarTurno(loteTurno.id, detalle);
      await refrescar();
    }
    setLoteTurno(null);
    setHorarioTurno("");
  }, [horarioTurno, loteTurno, refrescar]);

  const confirmarSensor = useCallback(async () => {
    const codigo = codigoSensor.trim();
    if (codigo.length < 4) {
      Alert.alert("Código inválido", "Ingresá el código del sensor LoRa (4+ caracteres).");
      return;
    }
    await vincularSensor(codigo);
    setVincularVisible(false);
    setCodigoSensor("");
    await refrescar();
  }, [codigoSensor, refrescar]);

  return (
    <SafeAreaView style={estilos.fondo}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.contenido}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.cabecera}>
          <View style={styles.cabeceraIzq}>
            <View style={styles.logoCirculo}>
              <MaterialCommunityIcons name="sprout" size={20} color={colores.sobreContenedorSecundario} />
            </View>
            <Text style={styles.tituloPantalla}>Sensores</Text>
          </View>
          <View style={styles.cabeceraDer}>
            <Pressable style={styles.botonIcono}>
              <MaterialCommunityIcons name="bell-outline" size={22} color={colores.sobreSuperficieVariante} />
            </Pressable>
            <Pressable style={styles.avatarMini} onPress={() => router.push("/Perfil")}>
              <MaterialCommunityIcons name="account" size={18} color={colores.sobrePrimario} />
            </Pressable>
          </View>
        </View>

        <View style={styles.tarjetaGateway}>
          <View style={styles.gatewayFila}>
            <View style={styles.gatewayIzq}>
              <View style={styles.gatewayPunto}>
                <MaterialCommunityIcons name="access-point" size={18} color={colores.sobreContenedorSecundario} />
                <View style={styles.puntoVivo} />
              </View>
              <View style={styles.gatewayTitulos}>
                <Text style={styles.gatewayNombre} numberOfLines={1}>
                  Gateway Central Mendoza
                </Text>
                <Text style={styles.gatewaySubtitulo}>Red LoRaWAN Activa</Text>
              </View>
            </View>
            <View style={styles.señalBadge}>
              <MaterialCommunityIcons name="signal-cellular-3" size={16} color={colores.acentoOliva} />
              <Text style={styles.señalTexto}>99.8%</Text>
            </View>
          </View>
          <View style={styles.gatewayPie}>
            <View style={styles.filaConEspacio}>
              <MaterialCommunityIcons name="antenna" size={16} color={colores.acentoOliva} />
              <Text style={styles.gatewayInfo}>{`${totalSensores} sensores LoRaWAN en línea`}</Text>
            </View>
            <View style={styles.filaConEspacio}>
              <MaterialCommunityIcons name="sync" size={14} color={colores.acentoTierra} />
              <Text style={styles.gatewaySync}>Sincronizado hace 2m</Text>
            </View>
          </View>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chips}>
          {filtros.map((chip) => {
            const activo = chipActivo === chip.id;
            return (
              <Pressable
                key={chip.id}
                onPress={() => setChipActivo(chip.id)}
                style={[styles.chip, activo ? styles.chipActivo : styles.chipInactivo]}
              >
                {chip.punto ? (
                  <View style={styles.filaChips}>
                    <View style={[styles.puntoChipe, { backgroundColor: chip.punto }]} />
                    <Text style={[styles.chipTexto, activo ? styles.chipTextoActivo : undefined]}>
                      {chip.texto}
                    </Text>
                  </View>
                ) : (
                  <Text style={[styles.chipTexto, activo ? styles.chipTextoActivo : undefined]}>
                    {chip.texto}
                  </Text>
                )}
              </Pressable>
            );
          })}
        </ScrollView>

        {visibles.map((lote) => (
          <View key={lote.id} style={styles.tarjeta}>
            <CabeceraTarjeta lote={lote} />
            <ImagenTarjeta lote={lote} />
            {lote.estado === "riego" ? (
              <CuerpoRiego
                lote={lote}
                onPressGraficos={() => router.push(`/graficos/${lote.id}`)}
                onPressRiego={() => {
                  void accionRiego(lote);
                }}
              />
            ) : null}
            {lote.estado === "estres" ? (
              <CuerpoEstres
                lote={lote}
                onPressGraficos={() => router.push(`/graficos/${lote.id}`)}
                onPressRiego={() => {
                  void accionRiego(lote);
                }}
              />
            ) : null}
            {lote.estado === "programado" ? (
              <CuerpoProgramado
                lote={lote}
                onPressGraficos={() => router.push(`/graficos/${lote.id}`)}
                onPressTurno={() => {
                  setHorarioTurno(lote.turnoDetalle ?? "");
                  setLoteTurno(lote);
                }}
              />
            ) : null}
          </View>
        ))}

        {visibles.length === 0 ? (
          <View style={styles.vacio}>
            <MaterialCommunityIcons name="eye-off-outline" size={32} color={colores.borde} />
            <Text style={styles.vacioTexto}>No hay lotes en este estado</Text>
          </View>
        ) : null}

        <Pressable style={styles.botonVincular} onPress={() => setVincularVisible(true)}>
          <View style={styles.vincularIcono}>
            <MaterialCommunityIcons name="qrcode-scan" size={18} color={colores.primario} />
          </View>
          <Text style={styles.botonVincularTexto}>+ Vincular Nuevo Sensor LoRa</Text>
        </Pressable>
      </ScrollView>

      <Modal visible={loteTurno !== null} transparent animationType="fade" onRequestClose={() => setLoteTurno(null)}>
        <View style={styles.modalFondo}>
          <View style={styles.modalCaja}>
            <Text style={estilos.tituloHeadline}>Configurar Turno</Text>
            <Text style={styles.modalSuave}>{loteTurno?.variedad ?? ""}</Text>
            <TextInput
              style={styles.entrada}
              value={horarioTurno}
              onChangeText={setHorarioTurno}
              placeholder="Mañana 06:00 AM"
              placeholderTextColor={colores.borde}
            />
            <View style={styles.modalBotones}>
              <Pressable style={styles.modalBtonCalma} onPress={() => setLoteTurno(null)}>
                <Text style={styles.modalBtonCalmaTexto}>Cancelar</Text>
              </Pressable>
              <Pressable
                style={styles.modalBtonAmbar}
                onPress={() => {
                  void guardarTurno();
                }}
              >
                <Text style={styles.modalBtonAmbarTexto}>Guardar</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      <Modal visible={vincularVisible} transparent animationType="fade" onRequestClose={() => setVincularVisible(false)}>
        <View style={styles.modalFondo}>
          <View style={styles.modalCaja}>
            <Text style={estilos.tituloHeadline}>Vincular Sensor LoRa</Text>
            <Text style={styles.modalSuave}>Ingresá el código que figura en el sensor</Text>
            <TextInput
              style={styles.entrada}
              value={codigoSensor}
              onChangeText={setCodigoSensor}
              placeholder="LOR-XXXX"
              autoCapitalize="characters"
              autoCorrect={false}
              placeholderTextColor={colores.borde}
            />
            <View style={styles.modalBotones}>
              <Pressable style={styles.modalBtonCalma} onPress={() => setVincularVisible(false)}>
                <Text style={styles.modalBtonCalmaTexto}>Cancelar</Text>
              </Pressable>
              <Pressable
                style={styles.modalBtonAmbar}
                onPress={() => {
                  void confirmarSensor();
                }}
              >
                <Text style={styles.modalBtonAmbarTexto}>Vincular</Text>
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
  cabecera: {
    height: 64,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: colores.fondo,
  },
  cabeceraIzq: { flexDirection: "row", alignItems: "center", gap: 8 },
  logoCirculo: {
    width: 36,
    height: 36,
    borderRadius: radios.full,
    backgroundColor: colores.contenedorSecundario,
    alignItems: "center",
    justifyContent: "center",
  },
  tituloPantalla: {
    fontFamily: "BricolageGrotesque_800ExtraBold",
    fontSize: 20,
    fontWeight: "700",
    color: colores.primario,
  },
  cabeceraDer: { flexDirection: "row", alignItems: "center", gap: 8 },
  botonIcono: {
    width: 44,
    height: 44,
    borderRadius: radios.full,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarMini: {
    width: 32,
    height: 32,
    borderRadius: radios.full,
    backgroundColor: colores.primario,
    alignItems: "center",
    justifyContent: "center",
  },
  tarjetaGateway: {
    marginHorizontal: 20,
    marginTop: 12,
    padding: 16,
    borderRadius: radios["2xl"],
    backgroundColor: "#eae8e48c",
  },
  gatewayFila: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 8 },
  gatewayIzq: { flex: 1, minWidth: 0, flexDirection: "row", alignItems: "center", gap: 8 },
  gatewayPunto: {
    width: 32,
    height: 32,
    borderRadius: radios.full,
    backgroundColor: colores.contenedorSecundario,
    alignItems: "center",
    justifyContent: "center",
  },
  puntoVivo: {
    position: "absolute",
    top: -2,
    right: -2,
    width: 10,
    height: 10,
    borderRadius: radios.full,
    backgroundColor: colores.acentoOliva,
    borderWidth: 2,
    borderColor: colores.superficieContenedorMasBajo,
  },
  gatewayTitulos: { flex: 1, minWidth: 0, gap: 2 },
  gatewayNombre: { fontFamily: "Karla_700Bold", fontSize: 14, color: colores.sobreFondo },
  gatewaySubtitulo: { fontFamily: "Karla_400Regular", fontSize: 12, color: "#64748b" },
  señalBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: colores.badgeSuave,
    borderRadius: radios.full,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  señalTexto: { fontFamily: "Karla_700Bold", fontSize: 12, color: colores.sobreBadge },
  gatewayPie: {
    marginTop: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
  },
  gatewayInfo: { fontFamily: "Karla_400Regular", fontSize: 13, color: "#64748b" },
  gatewaySync: { fontFamily: "Karla_500Medium", fontSize: 12, color: colores.acentoTierra },
  chips: { paddingHorizontal: 20, paddingVertical: 8, gap: 8 },
  chip: { borderRadius: radios.full, paddingHorizontal: 10, paddingVertical: 8 },
  chipActivo: {
    backgroundColor: colores.acentoAmbar,
    shadowColor: "rgba(217,119,6,0.25)",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 2,
  },
  chipInactivo: {
    backgroundColor: colores.superficieContenedorMasBajo,
    shadowColor: "rgba(120,53,15,0.05)",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 1,
  },
  chipTexto: { fontFamily: "Karla_500Medium", fontSize: 14, color: "#64748b" },
  chipTextoActivo: { color: colores.sobrePrimario },
  filaChips: { flexDirection: "row", alignItems: "center", gap: 4 },
  filaConEspacio: { flexDirection: "row", alignItems: "center", gap: 6 },
  puntoChipe: { width: 8, height: 8, borderRadius: radios.full },
  tarjeta: {
    marginHorizontal: 20,
    marginTop: 12,
    padding: 16,
    borderRadius: radios["2xl"],
    backgroundColor: colores.superficieContenedorMasBajo,
    ...sombras.nivel1,
  },
  tarjetaCabecera: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 8,
    marginBottom: 12,
  },
  tarjetaTitulos: { flex: 1, minWidth: 0, gap: 4 },
  filaMeta: { flexDirection: "row", alignItems: "center", gap: 6 },
  metaLote: {
    fontFamily: "Karla_700Bold",
    fontSize: 12,
    color: colores.acentoTierra,
    letterSpacing: 0.8,
  },
  puntoSeparador: {
    width: 4,
    height: 4,
    borderRadius: radios.full,
    backgroundColor: colores.bordeVariante,
  },
  metaSuave: { fontFamily: "Karla_500Medium", fontSize: 12, color: "#64748b" },
  variedad: {
    fontFamily: "BricolageGrotesque_800ExtraBold",
    fontSize: 20,
    color: colores.sobreFondo,
  },
  pastilla: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    borderRadius: radios.full,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  pastillaTexto: {
    fontFamily: "Karla_700Bold",
    fontSize: 12,
    color: colores.sobreBadge,
  },
  contenedorImagen: { height: 112, borderRadius: radios.lg, overflow: "hidden" },
  imagen: { width: "100%", height: "100%" },
  veloImagen: { position: "absolute", left: 0, right: 0, bottom: 0, top: 0, justifyContent: "flex-end" },
  chipImagen: {
    position: "absolute",
    left: 10,
    bottom: 8,
    right: 10,
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "rgba(0,0,0,0.35)",
    borderRadius: radios.full,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  chipImagenTexto: { fontFamily: "Karla_500Medium", fontSize: 12, color: colores.sobrePrimario },
  cuerpo: { gap: 12, marginTop: 12 },
  filaFichas: { flexDirection: "row", gap: 8 },
  ficha: {
    flex: 1,
    padding: 10,
    borderRadius: radios.lg,
    backgroundColor: colores.superficieContenedorBajo,
    gap: 4,
  },
  fichaFila: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  textoSuave: { fontFamily: "Karla_500Medium", fontSize: 12, color: "#64748b" },
  filaBaseAlta: { flexDirection: "row", alignItems: "baseline", gap: 6 },
  valorFicha: {
    fontFamily: "BricolageGrotesque_800ExtraBold",
    fontSize: 22,
    color: colores.sobreFondo,
  },
  unidadFicha: { fontFamily: "Karla_500Medium", fontSize: 12, color: "#64748b" },
  notaFicha: { fontSize: 12, lineHeight: 14 },
  puntoEstado: { width: 10, height: 10, borderRadius: radios.full },
  barraFondo: {
    height: 8,
    borderRadius: radios.full,
    backgroundColor: colores.varianteSuperficie,
    overflow: "hidden",
  },
  barraLleno: { height: "100%", borderRadius: radios.full },
  panelRaiz: {
    padding: 10,
    borderRadius: radios.lg,
    backgroundColor: colores.fondo,
    gap: 6,
  },
  filaJustificada: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
  },
  valoresRaiz: { fontFamily: "Karla_700Bold", fontSize: 14, color: colores.sobreFondo },
  pieTarjeta: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
  },
  filaBotones: { flexDirection: "row", gap: 8, justifyContent: "flex-end", flexWrap: "wrap" },
  botonFicha: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: colores.superficieContenedorAlto,
    borderRadius: radios.full,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  botonFichaAmbar: {
    backgroundColor: colores.acentoAmbar,
    shadowColor: "rgba(217,119,6,0.3)",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 3,
  },
  botonFichaPeligro: { backgroundColor: colores.contenedorError },
  botonFichaClaroTexto: {
    fontFamily: "Karla_700Bold",
    fontSize: 14,
    color: colores.sobrePrimario,
  },
  pieSeparador: { color: "#64748b", marginHorizontal: 4 },
  panelBulbo: {
    padding: 16,
    borderRadius: radios.lg,
    backgroundColor: colores.superficieContenedorBajo,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  anillo: { width: 56, height: 56, alignItems: "center", justifyContent: "center" },
  anilloGiro: { position: "absolute", transform: [{ rotate: "-90deg" }] },
  anilloTexto: {
    position: "absolute",
    fontFamily: "Karla_700Bold",
    fontSize: 12,
    color: colores.error,
  },
  panelAgro: {
    padding: 10,
    borderRadius: radios.lg,
    backgroundColor: "#ffdcc344",
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
  },
  agroIcono: {
    width: 32,
    height: 32,
    borderRadius: radios.full,
    backgroundColor: colores.acentoAmbar,
    alignItems: "center",
    justifyContent: "center",
  },
  agroContenido: { flex: 1, minWidth: 0, gap: 4 },
  agroTitulo: { fontFamily: "Karla_700Bold", fontSize: 12, color: colores.acentoTierra },
  pillUrgente: {
    backgroundColor: "#D9770633",
    borderRadius: radios.full,
    paddingHorizontal: 6,
    paddingVertical: 1,
  },
  pillUrgenteTexto: {
    fontFamily: "Karla_500Medium",
    fontSize: 12,
    color: colores.acentoTierra,
  },
  agroTexto: {
    fontFamily: "Karla_400Regular",
    fontSize: 14,
    lineHeight: 18,
    color: colores.sobreFondo,
  },
  botonRiego: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: colores.acentoAmbar,
    borderRadius: radios.full,
    paddingVertical: 12,
    shadowColor: "rgba(217,119,6,0.3)",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 4,
  },
  botonRiegoTexto: {
    fontFamily: "Karla_700Bold",
    fontSize: 14,
    color: colores.sobrePrimario,
  },
  vacio: {
    marginHorizontal: 20,
    marginTop: 20,
    padding: 32,
    borderRadius: radios["2xl"],
    backgroundColor: colores.superficieContenedorMasBajo,
    alignItems: "center",
    gap: 8,
    ...sombras.nivel1,
  },
  vacioTexto: { fontFamily: "Karla_400Regular", fontSize: 14, color: colores.borde },
  botonVincular: {
    marginHorizontal: 20,
    marginTop: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    backgroundColor: colores.superficieContenedorMasBajo,
    borderRadius: radios.full,
    paddingVertical: 14,
    ...sombras.nivel2,
  },
  vincularIcono: {
    width: 28,
    height: 28,
    borderRadius: radios.full,
    backgroundColor: colores.primarioFijo,
    alignItems: "center",
    justifyContent: "center",
  },
  botonVincularTexto: {
    fontFamily: "Karla_700Bold",
    fontSize: 14,
    color: colores.primario,
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
  modalBtonCalma: {
    borderRadius: radios.full,
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: colores.superficieContenedorAlto,
  },
  modalBtonCalmaTexto: {
    fontFamily: "Karla_700Bold",
    fontSize: 14,
    color: colores.sobreSuperficieVariante,
  },
  modalBtonAmbar: {
    borderRadius: radios.full,
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: colores.acentoAmbar,
  },
  modalBtonAmbarTexto: {
    fontFamily: "Karla_700Bold",
    fontSize: 14,
    color: colores.sobrePrimario,
  },
});
