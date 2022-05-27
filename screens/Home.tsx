import { StyleSheet, Text, View } from "react-native";

import { RootTabScreenProps } from "../types";

export default function Home({ navigation }: RootTabScreenProps<"TabOne">) {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Tab One</Text>
            <View style={{ ...styles.separator, backgroundColor: "rgba(255,255,255,0.1)" }} />
            
            <Text style={{ ...styles.getStartedText, color: "rgba(255,255,255,0.8)" }}>
                Change any of the text, save the file, and your app will automatically update.
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    title: {
        fontSize: 20,
        fontWeight: "bold",
    },
    separator: {
        marginVertical: 30,
        height: 1,
        width: "80%",
    },
    getStartedText: {
        fontSize: 17,
        lineHeight: 24,
        textAlign: "center",
    },
});
