import express, { Request, Response } from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "Bienvenido a API03 de SIASIS" }).status(200);
});

// Endpoint para obtener la hora actual del servidor en una zona horaria especificada
app.get("/api/time", (req: Request, res: Response) => {
  try {
    const timezone = (req.query.timezone as string) || "America/Lima";

    // Obtener la hora actual del servidor
    const serverTime = new Date();

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

    // Responder con el timestamp y otros datos útiles
    res.json({
      serverTime: serverTime.toISOString(),
      timezone: timezone,
      localTime: humanReadableTime,
      zonedTimestamp: localDate.getTime(),
    });
  } catch (error) {
    res.status(400).json({
      error: "Error al procesar la zona horaria",
      message: error instanceof Error ? error.message : "Error desconocido",
    });
  }
});

// Para iniciar el servidor (código de muestra)
const PORT = process.env.PORT || 4003;

app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
