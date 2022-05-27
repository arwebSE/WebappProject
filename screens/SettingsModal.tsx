import React, { useEffect, useState } from "react";
import { Pressable, SafeAreaView, StyleSheet, Text, View } from "react-native";
import { StackActions, useNavigation } from "@react-navigation/native";
import { showMessage } from "react-native-flash-message";

import config from "../config/config.json";
import authModel from "../models/auth";
import Colors from "../constants/Colors";

export default function SettingsModal() {
    const [isLoggedIn, setIsLoggedIn] = useState<Boolean>(false);
    const navigation = useNavigation();

    useEffect(() => {
        const setLoggedIn = async () => {
            setIsLoggedIn(await authModel.loggedIn());
        };
        setLoggedIn();
    }, []);

    const logout = async () => {
        await authModel.logout();
        console.log("Logged out user!");
        showMessage({
            message: "Logout",
            description: "User logged out successfully!",
            type: "success",
        });
        navigation.dispatch(StackActions.popToTop());
    };

    return (
        <SafeAreaView style={styles.container}>
            {isLoggedIn ? (
                <View style={styles.logout}>
                    <Pressable onPress={() => logout()} style={({ pressed }) => ({ opacity: pressed ? 0.5 : 1 })}>
                        <Text style={styles.header}>Logout</Text>
                    </Pressable>
                </View>
            ) : (
                <Text style={styles.title}>Login to access settings</Text>
            )}
        </SafeAreaView>
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
        color: "white",
    },
    separator: {
        marginVertical: 30,
        height: 1,
        width: "80%",
    },
    getStartedContainer: {
        alignItems: "center",
        marginHorizontal: 50,
    },
    homeScreenFilename: {
        marginVertical: 7,
    },
    codeHighlightContainer: {
        borderRadius: 3,
        paddingHorizontal: 4,
    },
    getStartedText: {
        fontSize: 17,
        lineHeight: 24,
        textAlign: "center",
    },
    helpContainer: {
        marginTop: 15,
        marginHorizontal: 20,
        alignItems: "center",
    },
    helpLink: {
        paddingVertical: 15,
    },
    helpLinkText: {
        textAlign: "center",
    },
    header: {
        fontSize: 35,
        fontWeight: "bold",
        color: "white",
    },
    logout: {
        backgroundColor: Colors.tint,
        borderRadius: 10,
        padding: 15,
        textAlign: "center",
    },
});
