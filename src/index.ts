import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import { obtenerConfiguracionActual } from "./utils/obtenerConfiguracionActual";
import { GITHUB_GIST_ID, GITHUB_TOKEN } from "./config/GIST_DATA";
import { getMockedServerTime } from "./mock/getMockedServerTime";

// Cargar variables de entorno
dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "Bienvenido a API03 de SIASIS" }).status(200);
});

// Endpoint para obtener la hora actual del servidor en una zona horaria especificada
app.get("/api/time", async (req: Request, res: Response) => {
  try {
    const timezone = (req.query.timezone as string) || "America/Lima";

    // Obtener la hora actual del servidor (con mockeo aplicado)
    const serverTime = await getMockedServerTime();
    const originalServerTime = new Date(); // Hora real sin modificaciones
    const config = await obtenerConfiguracionActual();

    // Formatear para mostrar hora legible en la zona horaria solicitada
    const options: Intl.DateTimeFormatOptions = {
      timeZone: timezone,
      year: "numeric",
      month: "numeric",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
      hour12: false,
      timeZoneName: "short",
    };

    const humanReadableTime = new Intl.DateTimeFormat("es-PE", options).format(
      serverTime
    );

    // Obtener componentes de fecha/hora en la zona horaria solicitada
    const dateTimeFormat = new Intl.DateTimeFormat("en-US", {
      timeZone: timezone,
      year: "numeric",
      month: "numeric",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
      hour12: false,
    });

    // Convertir a string y luego parsear a Date
    const localDateStr = dateTimeFormat.format(serverTime);
    const localDate = new Date(localDateStr);

    // Determinar si hay mockeo activo
    const isMockeoActivo = config.MOCKEO_ACTIVO;

    // Responder con el timestamp y otros datos útiles
    const response: any = {
      serverTime: serverTime.toISOString(),
      timezone: timezone,
      localTime: humanReadableTime,
      zonedTimestamp: localDate.getTime(),
      mockeoActivo: isMockeoActivo,
      configuracionFuente: config.fuente,
    };

    // Si hay mockeo activo, incluir información adicional
    if (isMockeoActivo) {
      response.mockeoAplicado = {
        meses: config.MOCKEO_MESES,
        dias: config.MOCKEO_DIAS,
        horas: config.MOCKEO_HORAS,
        minutos: config.MOCKEO_MINUTOS,
        segundos: config.MOCKEO_SEGUNDOS,
      };
      response.tiempoRealServidor = originalServerTime.toISOString();
      response.diferenciaMilisegundos =
        serverTime.getTime() - originalServerTime.getTime();
    }

    res.json(response);
  } catch (error) {
    res.status(400).json({
      error: "Error al procesar la zona horaria",
      message: error instanceof Error ? error.message : "Error desconocido",
    });
  }
});

// Endpoint para consultar la configuración actual de mockeo
app.get("/api/mockeo-config", async (req: Request, res: Response) => {
  try {
    const config = await obtenerConfiguracionActual();

    res.json({
      mockeoActivo: config.MOCKEO_ACTIVO,
      configuracionFuente: config.fuente,
      mockeoConfiguracion: {
        meses: config.MOCKEO_MESES,
        dias: config.MOCKEO_DIAS,
        horas: config.MOCKEO_HORAS,
        minutos: config.MOCKEO_MINUTOS,
        segundos: config.MOCKEO_SEGUNDOS,
      },
     
      mensaje:
        config.fuente === "gist"
          ? "Configuración cargada desde GitHub Gist"
          : "Usando configuración local. Para usar Gist, configura GITHUB_GIST_ID en las variables de entorno (.env)",
    });
  } catch (error) {
    res.status(500).json({
      error: "Error al obtener configuración",
      message: error instanceof Error ? error.message : "Error desconocido",
    });
  }
});

// Para iniciar el servidor (código de muestra)
const PORT = process.env.PORT || 4003;

app.listen(PORT, async () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);

  // Verificar configuración inicial
  try {
    const config = await obtenerConfiguracionActual();
    console.log(`Configuración cargada desde: ${config.fuente}`);
    console.log(`Mockeo activo: ${config.MOCKEO_ACTIVO ? "SÍ" : "NO"}`);

    if (config.MOCKEO_ACTIVO) {
      console.log(
        `Configuración de mockeo: +${config.MOCKEO_MESES} meses, +${config.MOCKEO_DIAS} días, +${config.MOCKEO_HORAS} horas, +${config.MOCKEO_MINUTOS} minutos, +${config.MOCKEO_SEGUNDOS} segundos`
      );
    }

    if (GITHUB_GIST_ID) {
      console.log(`GitHub Gist configurado: ${GITHUB_GIST_ID}`);
      console.log(
        `Token GitHub: ${
          GITHUB_TOKEN ? "Configurado" : "No configurado (solo gists públicos)"
        }`
      );
    } else {
      console.log("GitHub Gist no configurado - usando valores locales");
      console.log(
        "Para usar Gist remoto, configura GITHUB_GIST_ID en las variables de entorno (.env)"
      );
    }
  } catch (error) {
    console.error(
      "Error al cargar configuración inicial:",
      (error as Error).message
    );
  }
});
