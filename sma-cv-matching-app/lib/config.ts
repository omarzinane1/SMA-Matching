// Configuration de l'application

export const config = {
  // URLs
  API_BASE_URL: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  FLASK_URL: process.env.FLASK_API_URL || 'http://localhost:5000',

  // File upload
  ALLOWED_FILE_TYPES: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
  ALLOWED_EXTENSIONS: ['.pdf', '.doc', '.docx'],
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB

  // Score thresholds
  SCORE_EXCELLENT: 80,
  SCORE_GOOD: 60,
  SCORE_POOR: 0,

  // Pagination
  ITEMS_PER_PAGE: 10,

  // Timeouts
  API_TIMEOUT: 30000, // 30 secondes
  POLLING_INTERVAL: 5000, // 5 secondes pour vérifier les analyses

  // Messages
  MESSAGES: {
    SUCCESS: {
      LOGIN: 'Connecté avec succès',
      LOGOUT: 'Déconnecter avec succès',
      UPLOAD: 'CV téléchargé avec succès',
      DELETE: 'CV supprimé avec succès',
      CREATE_OFFER: 'Offre créée avec succès',
    },
    ERROR: {
      LOGIN: 'Identifiants invalides',
      UPLOAD: 'Échec du téléchargement',
      NETWORK: 'Erreur réseau',
      UNAUTHORIZED: 'Non authentifié',
    },
  },
};

export default config;
