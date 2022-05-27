import config from "../config/config.json";

const traffic = {
    getStations: async function getStations() {
        const response = await fetch(`${config.baseUrl}/stations`);
        const result = await response.json();
        return result.data;
    },
    getMessages: async function getMessages() {
        const response = await fetch(`${config.baseUrl}/messages`);
        const result = await response.json();
        return result.data;
    },
    getCodes: async function getCodes() {
        const response = await fetch(`${config.baseUrl}/codes`);
        const result = await response.json();
        return result.data;
    },
    getDelayed: async function getDelayed() {
        const response = await fetch(`${config.baseUrl}/delayed`);
        const result = await response.json();
        return result.data;
    },
};

export default traffic;
