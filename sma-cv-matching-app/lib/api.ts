import { config } from './config';

interface FetchOptions extends RequestInit {
  headers?: Record<string, string>;
}

interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

/**
 * Wrapper autour de fetch pour les appels API
 * Ajoute automatiquement le token JWT aux headers
 */
export async function apiCall<T = unknown>(
  endpoint: string,
  options: FetchOptions = {}
): Promise<ApiResponse<T>> {
  try {
    const url = `${config.API_BASE_URL}${endpoint}`;
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const error = await response.json();
      return {
        error: error.message || 'Request failed',
      };
    }

    const data = await response.json();
    return { data };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return {
      error: message,
    };
  }
}

/**
 * Upload un fichier (FormData)
 */
export async function uploadFile(
  endpoint: string,
  file: File,
  additionalData?: Record<string, string>
): Promise<ApiResponse<unknown>> {
  try {
    const url = `${config.API_BASE_URL}${endpoint}`;
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

    const formData = new FormData();
    formData.append('file', file);

    if (additionalData) {
      Object.entries(additionalData).forEach(([key, value]) => {
        formData.append(key, value);
      });
    }

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      return {
        error: error.message || 'Upload failed',
      };
    }

    const data = await response.json();
    return { data };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Upload failed';
    return {
      error: message,
    };
  }
}

/**
 * Helper pour déterminer la couleur selon le score
 */
export function getScoreColor(score: number): string {
  if (score >= config.SCORE_EXCELLENT) return 'text-green-600 bg-green-50';
  if (score >= config.SCORE_GOOD) return 'text-yellow-600 bg-yellow-50';
  return 'text-red-600 bg-red-50';
}

export function getScoreBadgeClass(score: number): string {
  if (score >= config.SCORE_EXCELLENT) return 'bg-green-100 text-green-800';
  if (score >= config.SCORE_GOOD) return 'bg-yellow-100 text-yellow-800';
  return 'bg-red-100 text-red-800';
}

/**
 * Formate un fichier pour l'upload
 */
export function validateFile(file: File): { valid: boolean; error?: string } {
  if (!config.ALLOWED_FILE_TYPES.includes(file.type)) {
    return {
      valid: false,
      error: `Type de fichier non autorisé. Acceptés: ${config.ALLOWED_EXTENSIONS.join(', ')}`,
    };
  }

  if (file.size > config.MAX_FILE_SIZE) {
    return {
      valid: false,
      error: `Fichier trop volumineux. Maximum: ${config.MAX_FILE_SIZE / 1024 / 1024}MB`,
    };
  }

  return { valid: true };
}
