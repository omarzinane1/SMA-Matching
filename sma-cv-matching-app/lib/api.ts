const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

/* ===============================
   TYPES & INTERFACES
================================ */

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
  _id: string;
  title: string;
  description: string;
  date_created: string;
  cv_ids: any;
}

export interface CV {
  _id: string;
  full_name: string;
  email: string;
  skills: string[];
  score: {
    score: number;
    matched_skills: string[];
    total_offer_skills: number;
    total_cv_skills: number;
  };
  file_url?: string;
}

export interface ResultsResponse {
  cvs: CV[];
}

/* ===============================
   AUTH APIs
================================ */

export async function login(
  email: string,
  password: string
): Promise<AuthResponse> {
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

export async function register(
  email: string,
  password: string,
  name: string,
  role: string
): Promise<AuthResponse> {
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

/* ===============================
   JOB OFFERS APIs
================================ */

// Job Offers APIs
export async function getOffers(token: string): Promise<JobOffer[]> {
  const res = await fetch(`${API_BASE_URL}/offers`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error('Failed to fetch offers');
  }

  const data = await res.json();

  // ✅ هنا التحويل السحري
  return Array.isArray(data.offers) ? data.offers : [];
}

export async function createOffer(
  token: string,
  title: string,
  description: string
): Promise<{ offer_id: string }> {
  const res = await fetch(`${API_BASE_URL}/offers`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ title, description }),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || 'Failed to create offer');
  }

  return res.json(); // { message, offer_id }
}

export async function deleteOffer(
  token: string,
  offerId: string
): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/offers/${offerId}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error('Failed to delete offer');
  }
}

/* ===============================
   CV UPLOAD API
================================ */

export async function uploadCV(
  token: string,
  offerId: string,
  file: File
): Promise<CV> {
  const formData = new FormData();
  formData.append('cv', file); // ⚠️ نفس الاسم فالـ backend

  const res = await fetch(`${API_BASE_URL}/cv/upload/${offerId}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      // ❌ ما تحطش Content-Type
    },
    body: formData,
  });

  if (!res.ok) {
    let message = 'Failed to upload CV';
    try {
      const error = await res.json();
      message = error.message || message;
    } catch { }
    throw new Error(message);
  }

  return res.json();
}

/* ===============================
   RESULTS APIs
================================ */

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
  return data.top3; // ✅ backend كيرجع { message, top3 }
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
