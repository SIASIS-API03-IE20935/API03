import { obtenerConfiguracionActual } from "../utils/obtenerConfiguracionActual";

/**
 * Función para obtener la hora del servidor con modificaciones de mockeo
 */
export async function getMockedServerTime(): Promise<Date> {
  const originalTime = new Date();
  const config = await obtenerConfiguracionActual();

  // Si el mockeo no está activo, devolver la hora original
  if (!config.MOCKEO_ACTIVO) {
    return originalTime;
  }

  // Aplicar modificaciones de mockeo solo si está activo
  const mockedTime = new Date(originalTime);
  mockedTime.setMonth(mockedTime.getMonth() + config.MOCKEO_MESES);
  mockedTime.setDate(mockedTime.getDate() + config.MOCKEO_DIAS);
  mockedTime.setHours(mockedTime.getHours() + config.MOCKEO_HORAS);
  mockedTime.setMinutes(mockedTime.getMinutes() + config.MOCKEO_MINUTOS);
  mockedTime.setSeconds(mockedTime.getSeconds() + config.MOCKEO_SEGUNDOS);

  return mockedTime;
}
