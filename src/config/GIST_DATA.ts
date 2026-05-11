import "dotenv/config";

// ============= CONSTANTES DE MOCKEO =============
// Configuración del GitHub Gist desde variables de entorno
export const GITHUB_GIST_ID = process.env.GIST_SERVER_TIME_MOCK_ID || ""; // Variable de entorno
export const GITHUB_TOKEN = process.env.GIST_GITHUB_TOKEN_PAT || ""; // Variable de entorno (opcional)
export const GIST_MOCK_FILENAME = process.env.GIST_FILENAME || undefined;
