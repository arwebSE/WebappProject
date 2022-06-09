import React, { useEffect, useState } from "react";
import { Pressable, RefreshControl, SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native";
import { StackActions, useNavigation } from "@react-navigation/native";
import { showMessage } from "react-native-flash-message";

import authModel from "../models/auth";

export default function Favorites() {
    const navigation = useNavigation();
    const [loading, setLoading] = useState<boolean>(false);
    const [userData, setUserData] = useState<[{ id: number; email: string; artefact: string }] | []>([]);

    const fetchData = async () => {
        setLoading(true);
        const data = await authModel.getData();
        setUserData(data);
        setLoading(false);
    };

    useEffect(() => {
        fetchData();
    }, []);

    //return a row for each item in the array
    return (
        <View style={styles.container}>
            <ScrollView refreshControl={<RefreshControl refreshing={loading} onRefresh={fetchData} />}>
                <View>
                    <Text style={styles.title}>Favorites</Text>
                </View>
                {userData.map((row, index) => {
                    const data = row.artefact.replaceAll("'", "");
                    const jsonData = JSON.parse(data);

                    return (
                        <View style={styles.row} key={index}>
                            <Text style={styles.text}>{jsonData.place}</Text>
                            <Text style={styles.text}>{jsonData.latitude}</Text>
                            <Text style={styles.text}>{jsonData.longitude}</Text>
                        </View>
                    );
                })}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
    },
    title: {
        fontSize: 48,
        fontWeight: "bold",
        color: "white",
    },
    row: {
        flexDirection: "row",
        justifyContent: "space-between",
        backgroundColor: "red",
        margin: 5,
    },
    text: {
        fontSize: 20,
        fontWeight: "bold",
        color: "white",
    },
});
