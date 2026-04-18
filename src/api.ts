const API_URL = import.meta.env.VITE_API_URL || '/api';

const getHeaders = () => {
    const token = localStorage.getItem('admin_token');
    return {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    };
};

export const api = {
    // Applications
    async submitApplication(data: any) {
        const response = await fetch(`${API_URL}/applications`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify(data),
        });
        if (!response.ok) throw new Error('Failed to submit application');
        return response.json();
    },

    async getApplications() {
        const response = await fetch(`${API_URL}/admin/applications`, {
            headers: getHeaders(),
        });
        if (!response.ok) throw new Error('Failed to fetch applications');
        return response.json();
    },

    async updateApplicationStatus(id: string, status: string) {
        const response = await fetch(`${API_URL}/admin/applications/${id}`, {
            method: 'PUT',
            headers: getHeaders(),
            body: JSON.stringify({ status }),
        });
        if (!response.ok) throw new Error('Failed to update application');
        return response.json();
    },

    async deleteApplication(id: string) {
        const response = await fetch(`${API_URL}/admin/applications/${id}`, {
            method: 'DELETE',
            headers: getHeaders(),
        });
        if (!response.ok) throw new Error('Failed to delete application');
        return response.json();
    },

    // Contacts
    async submitContact(data: any) {
        const response = await fetch(`${API_URL}/contacts`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify(data),
        });
        if (!response.ok) throw new Error('Failed to submit contact');
        return response.json();
    },

    async getContacts() {
        const response = await fetch(`${API_URL}/admin/contacts`, {
            headers: getHeaders(),
        });
        if (!response.ok) throw new Error('Failed to fetch contacts');
        return response.json();
    },

    async deleteContact(id: string) {
        const response = await fetch(`${API_URL}/admin/contacts/${id}`, {
            method: 'DELETE',
            headers: getHeaders(),
        });
        if (!response.ok) throw new Error('Failed to delete contact');
        return response.json();
    },

    // Auth
    async login(email: string, password: string) {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Login failed');

        localStorage.setItem('admin_token', data.token);
        localStorage.setItem('admin_user', JSON.stringify(data.user));
        return data;
    },

    logout() {
        localStorage.removeItem('admin_token');
        localStorage.removeItem('admin_user');
    },

    getUser() {
        const user = localStorage.getItem('admin_user');
        return user ? JSON.parse(user) : null;
    }
};
