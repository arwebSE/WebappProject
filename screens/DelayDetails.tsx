import React, { useEffect, useState } from "react";
import { StyleSheet, View, Text, ScrollView, SafeAreaView, Pressable } from "react-native";
import { RouteProp, useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";

import { DelayedStation } from "../types";
import { findMessages } from "../utils/delays";
import Colors from "../constants/Colors";
import authModel from "../models/auth";

export default function DelayDetails({ route }: { route: RouteProp<{ params: { delay: DelayedStation } }> }) {
    const navigation = useNavigation();
    const delay: DelayedStation = route.params.delay;
    const oldTime = new Date(delay.AdvertisedTimeAtLocation);
    const newTime = new Date(delay.EstimatedTimeAtLocation);
    const [messages, setMessages] = useState<string[]>([]);

    const fetchMessages = async () => {
        if (messages[0] === "empty") {
            console.log("No messages found.");
            return;
        } else if (messages.length > 1) {
            console.log("Messages fetched!");
            return;
        } else {
            console.log("Fetching messages...");
            const res = await findMessages(delay.fromStation.LocationSignature);
            setMessages(res);
        }
    };

    const saveStation = () => {
        const saveData = {
            station: delay.fromStation.LocationSignature,
            name: delay.fromStation.AdvertisedLocationName,
            geo: delay.fromStation.Geometry,
        };
        const jsonData = JSON.stringify(saveData);
        console.log("Saving station:", saveData);
        authModel.saveData(jsonData);
    };

    useEffect(() => {
        fetchMessages();
        navigation.setOptions({
            title: "Details",
            headerRight: () => (
                <Pressable
                    onPress={() => {
                        saveStation();
                    }}
                    style={({ pressed }) => ({ opacity: pressed ? 0.5 : 1 })}
                >
                    <Ionicons name="heart-outline" size={30} color={Colors.text} style={{ marginRight: 15 }} />
                </Pressable>
            ),
        });
    });

    return (
        <SafeAreaView style={styles.container}>
            <View>
                <View style={{ flexDirection: "row", marginTop: 10 }}>
                    <Text style={styles.title}>
                        {delay.ActivityType == "Avgang" ? "Departure" : delay.ActivityType}{" "}
                    </Text>
                    <View style={{ ...styles.center, marginTop: 5 }}>
                        <View style={styles.pill}>
                            <Text style={styles.pillText}>{delay.AdvertisedTrainIdent}</Text>
                        </View>
                    </View>
                </View>
                <Text style={styles.subtitle}>
                    <Ionicons name="train" size={24} color="white" /> {delay.fromStation.AdvertisedLocationName}{" "}
                    {" 👉 "} {delay.toStation.AdvertisedLocationName}
                </Text>
            </View>

            <View style={styles.details}>
                <View style={{ marginVertical: 20 }}>
                    {delay.Canceled ? (
                        <Text style={{ ...styles.cancelled }}>NOTE: This train has been cancelled!</Text>
                    ) : null}
                    <Text style={styles.text}>
                        Planned departure time:{" "}
                        {oldTime.toLocaleTimeString("sv-SE", {
                            hour: "2-digit",
                            minute: "2-digit",
                        })}
                    </Text>
                    {delay.Canceled ? (
                        <Text style={styles.text}>New departure time: CANCELLED</Text>
                    ) : (
                        <Text style={styles.text}>
                            New departure time:{" "}
                            {newTime.toLocaleTimeString("sv-SE", {
                                hour: "2-digit",
                                minute: "2-digit",
                            })}
                        </Text>
                    )}

                    {messages.length > 1 ? (
                        <View style={styles.faults}>
                            <Text style={{ ...styles.subtitle, marginBottom: 5 }}>Faults affecting this station:</Text>
                            <ScrollView style={styles.faultsScroll}>
                                {messages.map((msg, index) => (
                                    <View key={index} style={styles.msgContainer}>
                                        <Text style={styles.msgHeader}>{msg.Header}</Text>
                                        <Text style={styles.msgText}>{msg.ExternalDescription}</Text>
                                    </View>
                                ))}
                            </ScrollView>
                        </View>
                    ) : null}
                </View>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 0,
        marginHorizontal: 10,
    },
    title: {
        fontSize: 48,
        fontWeight: "bold",
        color: "white",
    },
    subtitle: {
        fontSize: 23,
        fontWeight: "bold",
        color: "white",
    },
    text: {
        fontSize: 20,
        color: "white",
    },
    details: {
        padding: 10,
    },
    row: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    center: {
        alignContent: "center",
        justifyContent: "center",
    },
    pill: {
        backgroundColor: "#1F6398",
        borderRadius: 5,
        padding: 5,
    },
    pillText: {
        fontSize: 25,
        fontWeight: "bold",
        color: "white",
    },
    cancelled: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#FF6161",
        marginVertical: 10,
    },
    msgContainer: {
        marginVertical: 2,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: "gray",
        padding: 7,
    },
    msgHeader: {
        color: "lightblue",
        fontSize: 17,
        marginBottom: 5,
    },
    msgText: {
        color: "white",
        fontSize: 15,
    },
    faults: {
        marginVertical: 20,
    },
    faultsScroll: {
        maxHeight: 570,
    },
});
