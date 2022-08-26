import React, { useEffect, useState } from "react";
import { Pressable, SafeAreaView, StyleSheet, Text, View, ScrollView, RefreshControl } from "react-native";
import { StackActions, useNavigation } from "@react-navigation/native";
import { showMessage } from "react-native-flash-message";

import authModel from "../models/auth";
import storageModel from "../models/storage";
import Colors from "../constants/Colors";

export default function SettingsModal() {
    const navigation = useNavigation();
    const [isLoggedIn, setIsLoggedIn] = useState<Boolean>(false);
    const [userID, setUserID] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [userData, setUserData] = useState<[{ id: number; email: string; artefact: string }] | []>([]);
    const [userEmail, setUserEmail] = useState<string | null>(null);

    const fetchData = async () => {
        setLoading(true);
        const data = await authModel.getData();
        setUserData(data);
        const email = await storageModel.readEmail();
        setUserEmail(email);
        console.log("got data", data, "and email", email);
        setLoading(false);
    };

    useEffect(() => {
        const fetchLogin = async () => {
            const loggedIn = await authModel.loggedIn();
            setIsLoggedIn(loggedIn);
            if (loggedIn) setUserID(await authModel.getUserID());
            fetchData();
        };
        fetchLogin();
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

    const handleDelete = async (index: number) => {
        console.log("Deleting ", index);
        const result = await authModel.deleteData(index);
        showMessage({
            message: result.title,
            description: result.message,
            type: result.type,
        });

        fetchData();
    };

    return (
        <SafeAreaView style={styles.container}>
            {isLoggedIn ? (
                <>
                    <Text style={{...styles.text, alignSelf: "center" }}>
                        {userEmail}(ID: {userID})
                    </Text>

                    <View style={styles.logout}>
                        <Pressable onPress={() => logout()} style={({ pressed }) => ({ opacity: pressed ? 0.5 : 1 })}>
                            <Text style={styles.header}>Logout</Text>
                        </Pressable>
                    </View>

                    <ScrollView refreshControl={<RefreshControl refreshing={loading} onRefresh={fetchData} />}>
                        <View>
                            <Text style={styles.title}>Favorites</Text>
                            <View style={styles.row}>
                                <Text style={styles.text}>ID</Text>
                                <Text style={styles.text}>Name</Text>
                                <Text style={styles.text}>Action</Text>
                            </View>
                        </View>
                        {userData.map((row, index) => {
                            const data = row.artefact.replaceAll("'", "");
                            const jsonData = JSON.parse(data);

                            return (
                                <View style={styles.row} key={index}>
                                    <Text style={styles.text}>{jsonData.station}</Text>
                                    <Text style={styles.text}>{jsonData.name}</Text>
                                    <Pressable
                                        style={({ pressed }) => ({
                                            opacity: pressed ? 0.5 : 1,
                                        })}
                                        onPress={() => handleDelete(row.id)}
                                    >
                                        <Text style={styles.delete}>X</Text>
                                    </Pressable>
                                </View>
                            );
                        })}
                    </ScrollView>
                </>
            ) : (
                <Text style={styles.title}>Login to access settings</Text>
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    row: {
        flexDirection: "row",
        justifyContent: "space-between",
        margin: 10,
    },
    container: {
        padding: 10,
        margin: 10,
    },
    title: {
        fontSize: 30,
        fontWeight: "bold",
        color: "white",
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
        marginTop: 20,
        marginBottom: 40,
        alignSelf: "center",
    },
    text: {
        fontSize: 25,
        fontWeight: "bold",
        color: "white",
    },
    delete: {
        fontSize: 30,
        fontWeight: "bold",
        color: "red",
    },
});
