import { Key } from "readline";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    email: string;
    name: string;
    role: string;
  };
}

export interface JobOffer {
  date_created(date_created: any): import("react").ReactNode;
  id: string;
  _id: Key | string | null | undefined;
  title: string;
  description: string;
  createdAt: string;
  cvCount: number;
}

export interface CV {
  id: string;
  full_name: string;
  email: string;
  score: number;
  skills: string[];
  file_url?: string;
}

export interface ResultsResponse {
  offer_id: string;
  cvs: CV[];
}

// Auth APIs
export async function login(email: string, password: string): Promise<AuthResponse> {
  const res = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || 'Login failed');
  }
  
  return res.json();
}

export async function register(email: string, password: string, name: string, role: string): Promise<AuthResponse> {
  const res = await fetch(`${API_BASE_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password, name, role }),
  });
  
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || 'Registration failed');
  }
  
  return res.json();
}

// Job Offers APIs
export async function getOffers(token: string) {
  const res = await fetch('http://localhost:5000/api/offers', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) throw new Error('Failed to fetch offers');

  const data = await res.json();
  return data.offers; // ✅ نرجعو غير Array
}


export async function createOffer(token: string, title: string, description: string): Promise<JobOffer> {
  const res = await fetch(`${API_BASE_URL}/offers`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ title, description }),
  });
  
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || 'Failed to create offer');
  }
  
  return res.json();
}

export async function deleteOffer(token: string, offerId: string): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/offers/${offerId}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${token}` },
  });
  
  if (!res.ok) throw new Error('Failed to delete offer');
}

// CV Upload API
export async function uploadCV(token: string, offerId: string, file: File): Promise<CV> {
  const formData = new FormData();
  formData.append('cv', file); // ⚠️ le champ "cv" doit correspondre au backend

  const res = await fetch(`${API_BASE_URL}/cv/upload/${offerId}`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`, // le token est OK
      // ❌ Ne PAS mettre Content-Type ici, FormData le gère automatiquement
    },
    body: formData,
  });

  if (!res.ok) {
    let errorMessage = 'Failed to upload CV';
    try {
      const error = await res.json();
      errorMessage = error.message || errorMessage;
    } catch (err) {
      // si le JSON n’est pas renvoyé
    }
    throw new Error(errorMessage);
  }

  return res.json();
}

// ===============================
// Results APIs
// ===============================
export async function getResults(
  token: string,
  offerId: string
): Promise<ResultsResponse> {
  const res = await fetch(`${API_BASE_URL}/results/${offerId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error('Failed to fetch results');
  }

  return res.json();
}

export async function keepTop3(
  token: string,
  offerId: string
): Promise<CV[]> {
  const res = await fetch(`${API_BASE_URL}/results/top3/${offerId}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error('Failed to keep top 3 CVs');
  }

  const data = await res.json();
  return data.top3; // 🔥 TRÈS IMPORTANT
}

export async function deleteAllResults(
  token: string,
  offerId: string
): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/results/delete_all/${offerId}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error('Failed to delete all results');
  }
}