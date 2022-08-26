import React, { useEffect, useState } from "react";
import { Button, Pressable, RefreshControl, SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native";
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
        //console.log("got data", data);
    };

    useEffect(() => {
        fetchData();
    }, []);

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

    //return a row for each item in the array
    return (
        <View style={styles.container}>
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
        margin: 10,
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
