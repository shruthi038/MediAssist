const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const loginUser = async (email, password) => {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({ username: email, password: password }),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.detail || 'Failed to login');
  }
  return data; // contains access_token
};

export const registerUser = async (fullName, email, password) => {
  const response = await fetch(`${API_BASE_URL}/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email,
      password,
      full_name: fullName,
    }),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.detail || 'Failed to register');
  }
  return data;
};

// Helper function to handle authenticated requests
const authFetch = async (url, options = {}) => {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('No authentication token found');
  }

  const headers = {
    ...options.headers,
    'Authorization': `Bearer ${token}`
  };

  const response = await fetch(url, { ...options, headers });
  
  if (response.status === 401) {
    localStorage.removeItem('token');
    window.location.href = '/';
    throw new Error('Session expired');
  }

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.detail || 'API request failed');
  }
  return data;
};

export const getPrescriptions = async () => {
  return await authFetch(`${API_BASE_URL}/prescriptions`);
};

export const getDocuments = async () => {
  return await authFetch(`${API_BASE_URL}/documents`);
};

export const uploadDocument = async (formData) => {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('No authentication token found');
  }

  // Do not set Content-Type to application/json, let the browser set the correct multipart/form-data boundary
  const response = await fetch(`${API_BASE_URL}/documents/upload`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`
    },
    body: formData
  });

  if (response.status === 401) {
    localStorage.removeItem('token');
    window.location.href = '/';
    throw new Error('Session expired');
  }

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.detail || 'Failed to upload document');
  }
  return data;
};

export const getDocument = async (documentId) => {
  return await authFetch(`${API_BASE_URL}/documents/${documentId}`);
};

export const deleteDocument = async (documentId) => {
  return await authFetch(`${API_BASE_URL}/documents/${documentId}`, {
    method: 'DELETE'
  });
};

// Prescription specific endpoints
export const uploadPrescription = async (formData) => {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('No authentication token found');

  const response = await fetch(`${API_BASE_URL}/prescriptions/upload`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${token}` },
    body: formData
  });

  if (response.status === 401) {
    localStorage.removeItem('token');
    window.location.href = '/';
    throw new Error('Session expired');
  }

  const data = await response.json();
  if (!response.ok) throw new Error(data.detail || 'Failed to upload prescription');
  return data;
};

export const getPrescriptionDetails = async (id) => {
  return await authFetch(`${API_BASE_URL}/prescriptions/${id}`);
};

export const deletePrescription = async (id) => {
  return await authFetch(`${API_BASE_URL}/prescriptions/${id}`, { method: 'DELETE' });
};

export const getPrescriptionFileUrl = async (id) => {
  return await authFetch(`${API_BASE_URL}/prescriptions/${id}/file`);
};

// AI Pipeline Orchestration Endpoints
export const processOCR = async (id) => {
  return await authFetch(`${API_BASE_URL}/prescriptions/${id}/ocr`, { method: 'POST' });
};

export const extractMedicines = async (id) => {
  return await authFetch(`${API_BASE_URL}/prescriptions/${id}/extract-medicines`, { method: 'POST' });
};

export const generateReminders = async (id) => {
  return await authFetch(`${API_BASE_URL}/prescriptions/${id}/generate-reminders`, { method: 'POST' });
};

export const generateSummary = async (id) => {
  return await authFetch(`${API_BASE_URL}/prescriptions/${id}/generate-summary`, { method: 'POST' });
};

// AI Assistant Endpoints
export const sendChatMessage = async (message, sessionId, isVoice = false) => {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('No authentication token found');

  const response = await fetch(`${API_BASE_URL}/assistant/chat`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ message, session_id: sessionId, is_voice: isVoice })
  });

  if (response.status === 401) {
    localStorage.removeItem('token');
    window.location.href = '/';
    throw new Error('Session expired');
  }

  const data = await response.json();
  if (!response.ok) throw new Error(data.detail || 'Failed to send message');
  return data;
};

export const getChatHistory = async () => {
  return await authFetch(`${API_BASE_URL}/assistant/history`);
};

