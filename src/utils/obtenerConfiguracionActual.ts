import {
  MOCKEO_ACTIVO,
  MOCKEO_DIAS,
  MOCKEO_HORAS,
  MOCKEO_MESES,
  MOCKEO_MINUTOS,
  MOCKEO_SEGUNDOS,
} from "../mock/MOCKEO_DESFASE_TEMPORAL_LOCAL";
import { cargarConfiguracionGist } from "./obtenerConfiguracionMockeadaPorGist";

/**
 * Función para obtener la configuración actual (local o remota)
 */
export async function obtenerConfiguracionActual() {
  const configRemota = await cargarConfiguracionGist();

  if (configRemota) {
    return {
      MOCKEO_ACTIVO: configRemota.MOCKEO_ACTIVO ?? MOCKEO_ACTIVO,
      MOCKEO_MESES: configRemota.MOCKEO_MESES ?? MOCKEO_MESES,
      MOCKEO_DIAS: configRemota.MOCKEO_DIAS ?? MOCKEO_DIAS,
      MOCKEO_HORAS: configRemota.MOCKEO_HORAS ?? MOCKEO_HORAS,
      MOCKEO_MINUTOS: configRemota.MOCKEO_MINUTOS ?? MOCKEO_MINUTOS,
      MOCKEO_SEGUNDOS: configRemota.MOCKEO_SEGUNDOS ?? MOCKEO_SEGUNDOS,
      fuente: "gist",
    };
  }

  return {
    MOCKEO_ACTIVO,
    MOCKEO_MESES,
    MOCKEO_DIAS,
    MOCKEO_HORAS,
    MOCKEO_MINUTOS,
    MOCKEO_SEGUNDOS,
    fuente: "local",
  };
}
