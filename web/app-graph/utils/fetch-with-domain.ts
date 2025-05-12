import { API_SERVER_URL } from '@/utils/constants'

const fetchWithDomain = async (url: string, options?: RequestInit): Promise<Response> => {
    try {
        const response = await fetch(`${API_SERVER_URL}${url}`, options);

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Fetch error:', error);
        throw error;
    }
}

export default fetchWithDomain;
