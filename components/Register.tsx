import React, { useState } from "react";
import { showMessage } from "react-native-flash-message";

import AuthModel from "../models/auth";
import AuthFields from "../components/AuthFields";

export default function Login({ navigation }) {
    const [auth, setAuth] = useState<Partial<Auth>>({});

    const USEREXISTSERROR = "SQLITE_CONSTRAINT: UNIQUE constraint failed: users.email, users.apiKey";

    async function doRegister() {
        if (auth.email && auth.password) {
            const result = await AuthModel.register(auth.email, auth.password);
            let msg = result.message;
            if (result.message == USEREXISTSERROR) msg = "Email already registered.";
            if (result.type === "success") {
                console.log("User register success!");
            } else console.log(`Register Error: ${msg}`);
            showMessage({
                message: result.title,
                description: msg,
                type: result.type,
            });
        }
    }

    return <AuthFields auth={auth} setAuth={setAuth} submit={doRegister} title="Register" navigation={navigation} />;
}
