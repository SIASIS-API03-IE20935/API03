import {
  GIST_MOCK_FILENAME,
  GITHUB_GIST_ID,
  GITHUB_TOKEN,
} from "../config/GIST_DATA";

// Cache para la configuración remota
export let configuracionRemota: any = null;
export let ultimaActualizacion = 0;
export const CACHE_DURACION = 60000; // 1 minuto de cache
// ===============================================


/**
 * Función para cargar configuración desde GitHub Gist
 */
export async function cargarConfiguracionGist(): Promise<any> {
  if (!GITHUB_GIST_ID) {
    return null;
  }

  try {
    const ahora = Date.now();

    // Usar cache si está disponible y no ha expirado
    if (configuracionRemota && ahora - ultimaActualizacion < CACHE_DURACION) {
      return configuracionRemota;
    }

    const headers: any = {
      "User-Agent": "SIASIS-API-Time-Mockeo",
      Accept: "application/vnd.github.v3+json",
    };

    // Añadir token si está disponible (para gists privados)
    if (GITHUB_TOKEN) {
      headers["Authorization"] = `token ${GITHUB_TOKEN}`;
    }

    const response = await fetch(
      `https://api.github.com/gists/${GITHUB_GIST_ID}`,
      {
        headers,
      }
    );

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`);
    }

    const gistData = await response.json();

    // Buscar el archivo JSON en el gist (asumimos que se llama 'mockeo-config.json')
    const archivoConfig = GIST_MOCK_FILENAME
      ? gistData.files[GIST_MOCK_FILENAME]
      : Object.values(gistData.files)[0]; // Tomar el primer archivo si no encuentra los específicos

    if (!archivoConfig) {
      throw new Error("No se encontró archivo de configuración en el Gist");
    }

    const config = JSON.parse((archivoConfig as any).content);

    // Actualizar cache
    configuracionRemota = config;
    ultimaActualizacion = ahora;

    return config;
  } catch (error) {
    console.error(
      "Error al cargar configuración desde Gist:",
      (error as Error).message
    );
    return null;
  }
}
