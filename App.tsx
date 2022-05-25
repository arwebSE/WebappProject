import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import FlashMessage from "react-native-flash-message";

import Navigation from "./navigation";

export default function App() {
    return (
        <SafeAreaProvider>
            <Navigation />
            <StatusBar style="light" />
            <FlashMessage position="top" />
        </SafeAreaProvider>
    );
}
