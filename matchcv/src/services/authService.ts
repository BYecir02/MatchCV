const API_URL = 'http://localhost:8000/api/auth';

export const login = async (email: string, password: string) => {
    const response = await fetch(`${API_URL}/login/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
    });
    
    if (!response.ok) {
        throw new Error('Login failed');
    }
    
    return await response.json();
};

export const register = async (username: string, email: string, password: string, confirmPassword: string) => {
    const response = await fetch(`${API_URL}/register/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email, password, confirmPassword }),
    });
    
    if (!response.ok) {
        throw new Error('Registration failed');
    }
    
    return await response.json();
};