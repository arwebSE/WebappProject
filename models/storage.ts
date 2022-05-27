import AsyncStorage from '@react-native-async-storage/async-storage';

const storage = {
    storeToken: async function storeToken(token: string) {
        try {
            const tokenAndDate = {
                token: token,
                date: new Date().getTime(),
            };
            const jsonValue = JSON.stringify(tokenAndDate);
            await AsyncStorage.setItem('@token', jsonValue);
            console.log("Stored token!");
        } catch (e) {
            console.log("Token save error:", e);
        }
    },
    readToken: async function readToken(): Promise<any> {
        try {
            const jsonValue = await AsyncStorage.getItem('@token');
            console.log("Reading stored token...");
            return jsonValue != null ? JSON.parse(jsonValue) : null;
        } catch (e) {
            console.log("Token read error:", e);
        }
    },
    deleteToken: async function deleteToken() {
        await AsyncStorage.removeItem('@token');
    }
};

export default storage;
