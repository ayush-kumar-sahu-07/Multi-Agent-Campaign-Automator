const API_BASE = (() => {
  const base = import.meta.env.VITE_API_BASE_URL || '';
  const cleaned = base.replace(/\/$/, '').replace(/\/api$/, '');

  if (!cleaned) {
    console.warn('VITE_API_BASE_URL is not set. Falling back to same-origin /api requests.');
  }

  return cleaned;
})();

const request = async (path, { method = 'GET', body } = {}) => {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 45000);

  try {
    const res = await fetch(`${API_BASE}${path}`, {
      method,
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
      body: body ? JSON.stringify(body) : undefined,
      signal: controller.signal
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      const message = data?.error || `Request failed (${res.status})`;
      throw new Error(message);
    }

    return data;
  } catch (error) {
    if (error.name === 'AbortError') {
      throw new Error("Request timed out. Backend may be sleeping (Render cold start).");
    }
    throw error;
  } finally {
    clearTimeout(timeout);
  }
};



// ================= AUTH =================

// ⚠️ Make sure these match your backend routes EXACTLY

export const signupApi = (payload) => {
  return request('/api/signup', {
    method: 'POST',
    body: payload
  });
};

export const loginApi = (payload) => {
  return request('/api/login', {
    method: 'POST',
    body: payload
  });
};

export const logoutApi = () => {
  return request('/api/logout', {
    method: 'POST'
  });
};

export const getSessionApi = () => {
  return request('/api/session');
};

export const getDashboardApi = () => {
  return request('/api/dashboard');
};



// ================= WORKFLOW =================

export const runWorkflowApi = (payload) => {
  return request('/api/workflow/run', {
    method: 'POST',
    body: payload
  });
};



// ================= CAMPAIGNS =================

export const getCampaignHistoryApi = () => {
  return request('/api/campaigns/history');
};

export const createCampaignHistoryApi = (payload) => {
  return request('/api/campaigns/history', {
    method: 'POST',
    body: payload
  });
};

export const getCampaignHistoryByIdApi = (id) => {
  return request(`/api/campaigns/history/${id}`);
};