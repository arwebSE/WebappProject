import config from "../config/config.json";
import storage from "./storage";

const auth = {
    loggedIn: async function loggedIn() {
        const token = await storage.readToken();
        const twentyFourHours = 1000 * 60 * 60 * 24;
        if (token) {
            const notExpired = new Date().getTime() - token.date < twentyFourHours;
            return token && notExpired;
        }
        return;
    },
    login: async function login(email: string, password: string) {
        const data = {
            api_key: config.apiKey,
            email: email,
            password: password,
        };
        const response = await fetch(`${config.authUrl}/login`, {
            method: "POST",
            body: JSON.stringify(data),
            headers: {
                "content-type": "application/json",
            },
        });
        console.log("response", response);

        const result = await response.json();
        if (Object.prototype.hasOwnProperty.call(result, "errors")) {
            return {
                title: result.errors.title,
                message: result.errors.detail,
                type: "danger",
            };
        }
        await storage.storeToken(result.data.token);
        await storage.storeEmail(email);
        return {
            title: "Login",
            message: result.data.message,
            type: "success",
        };
    },
    getUserID: async function getUserID() {
        const response = await fetch(`${config.authUrl}/users?api_key=${config.apiKey}`);
        const result = await response.json();

        if (Object.prototype.hasOwnProperty.call(result, "errors")) {
            console.log("Error getting userID!");
            return;
        }
        const storedEmail = await storage.readEmail();
        const userObject = result.data.filter((usr) => usr.email === storedEmail);
        const userID = userObject[0].user_id;
        if (userID) {
            return userID;
        } else return;
    },
    register: async function register(email: string, password: string) {
        const data = {
            api_key: config.apiKey,
            email: email,
            password: password,
        };
        const response = await fetch(`${config.authUrl}/register`, {
            method: "POST",
            body: JSON.stringify(data),
            headers: {
                "content-type": "application/json",
            },
        });
        const result = await response.json();
        if (Object.prototype.hasOwnProperty.call(result, "errors")) {
            return {
                title: result.errors.title,
                message: result.errors.detail,
                type: "danger",
            };
        }
        await storage.storeToken(result.data.token);
        return {
            title: "Register",
            message: result.data.message,
            type: "success",
        };
    },
    logout: async function logout() {
        await storage.deleteToken();
        await storage.deleteEmail();
    },
    saveData: async function saveData(artefact: string) {
        const data = {
            api_key: config.apiKey,
            artefact,
        };
        const response = await fetch(`${config.authUrl}/data`, {
            method: "POST",
            body: JSON.stringify(data),
            headers: {
                "content-type": "application/json",
            },
        });
        const result = await response.json();
        if (Object.prototype.hasOwnProperty.call(result, "errors")) {
            return {
                title: result.errors.title,
                message: result.errors.detail,
                type: "danger",
            };
        }
        return {
            title: "Register",
            message: result.data.message,
            type: "success",
        };
    },
    deleteData: async function deleteData(id: number) {
        const data = {
            api_key: config.apiKey,
            id,
        };
        const response = await fetch(`${config.authUrl}/data`, {
            method: "DELETE",
            body: JSON.stringify(data),
            headers: {
                "content-type": "application/json",
            },
        });
        if (response) {
            return {
                title: "Deletion",
                message: "Deleted data!",
                type: "success",
            };
        } else {
            return {
                title: "Deletion",
                message: "Something went wrong.",
                type: "danger",
            };
        }
    },
};

export default auth;
