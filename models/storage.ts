import AsyncStorage from "@react-native-async-storage/async-storage";

const storage = {
    storeToken: async function storeToken(token: string) {
        try {
            const tokenAndDate = {
                token: token,
                date: new Date().getTime(),
            };
            const jsonValue = JSON.stringify(tokenAndDate);
            await AsyncStorage.setItem("@token", jsonValue);
            console.log("Stored token!");
        } catch (e) {
            console.log("Token save error:", e);
        }
    },
    readToken: async function readToken(): Promise<any> {
        try {
            const jsonValue = await AsyncStorage.getItem("@token");
            if (jsonValue) {
                console.log("Got stored token! Parsing...");
                const token = JSON.parse(jsonValue);
                return token;
            } else {
                console.log("No token stored! Need to login...");
                return null;
            }
        } catch (e) {
            console.log("Token read error:", e);
        }
    },
    deleteToken: async function deleteToken() {
        await AsyncStorage.removeItem("@token");
    },
    storeEmail: async function storeEmail(email: string) {
        try {
            const jsonValue = JSON.stringify(email);
            await AsyncStorage.setItem("@email", jsonValue);
            console.log("Stored email", email);
        } catch (e) {
            console.log("Email save error:", e);
        }
    },
    readEmail: async function readEmail(): Promise<any> {
        try {
            const jsonValue = await AsyncStorage.getItem("@email");
            console.log("Read stored email", jsonValue);
            return jsonValue != null ? JSON.parse(jsonValue) : null;
        } catch (e) {
            console.log("Email read error:", e);
        }
    },
    deleteEmail: async function deleteEmail() {
        await AsyncStorage.removeItem("@email");
    },
};

export default storage;
