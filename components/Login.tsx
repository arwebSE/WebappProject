import { useState } from "react";
import { showMessage } from "react-native-flash-message";

import AuthModel from "../models/auth";
import AuthFields from "../components/AuthFields";

export default function Login({ setIsLoggedIn }) {
    const [auth, setAuth] = useState<Partial<Auth>>({});

    async function doLogin() {
        if (auth.email && auth.password) {
            const result = await AuthModel.login(auth.email, auth.password);
            if (result.type === "success") {
                setIsLoggedIn(true);
            }
            showMessage({
                message: result.title,
                description: result.message,
                type: result.type,
            });
        } else {
            showMessage({
                message: "Cannot Login",
                description: "Email or password missing",
                type: "warning",
            });
        }
    }

    return <AuthFields auth={auth} setAuth={setAuth} submit={doLogin} title="Login" />;
}
