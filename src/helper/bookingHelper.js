import axios from 'axios';
// import * as dotenv from 'dotenv';
// dotenv.config()
const token = localStorage.getItem('token')
const placeholderApi = axios.create({
    baseURL: 'http://localhost:8080',
    headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
    }
});
export async function deleteBooking(id) {
    try {
        const { data } = await placeholderApi.delete(`/booking/deleteBooking/${id}`);
        return Promise.resolve({ data });
    } catch (error) {
        return Promise.reject({ error: 'Could not delete' });
    }
}
export async function updateBooking(id) {
    try {
        return await placeholderApi.post(`/booking/updateBooking/${id}`);
    } catch (error) {
        return Promise.reject({ error: 'Could not update' });
    }
}
export async function getAllBookings() {
    try {
        const { data } = await placeholderApi.get('/booking/getAllBookings');
        return Promise.resolve({ data });
    } catch (error) {
        return Promise.reject({ error: 'Could not get' });
    }
}
export async function createBooking(data) {
    try {
        return await placeholderApi.post(`/booking/createBooking`, data);
    } catch (error) {
        return Promise.reject({ error: 'Could not create' });
    }
}
