// Author: trangtttce191027
import axios from "axios";

const BASE_URL = 'https://dummyjson.com';

const activityApi = axios.create({
    baseURL: BASE_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});
export const fetchActivities = async (limit = 10, skip = 0, searchQuery = '') => {
    try {
        let endpoint = `/posts?limit=${Number(limit)}&skip=${skip}`;
        if (searchQuery.trim() !== '') {
            endpoint = `/posts/search?q=${encodeURIComponent(searchQuery)}&limit=${limit}&skip=${skip}`;
        }
        const response = await activityApi.get(endpoint);
        return response.data;
    } catch (error) {
        console.error('Error fetching activities:', error);
        throw error;
    }
}

export const fetchActivitiesByTag = async (tag, limit = 10, skip = 0) => {
    try {
        const response = await activityApi.get(`/posts/tag/${tag}?limit=${limit}&skip=${skip}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching posts for tag ${tag}:`, error);
        throw error;
    }
}