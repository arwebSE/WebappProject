import React, { useEffect, useState } from "react";
import { ActivityIndicator, Pressable, RefreshControl, ScrollView, StyleSheet, Text, View } from "react-native";
import { StackActions, useIsFocused, useNavigation } from "@react-navigation/native";
import { showMessage } from "react-native-flash-message";
import { Ionicons } from "@expo/vector-icons";

import authModel from "../models/auth";
import { DelayedStation } from "../types";
import { getDelays } from "../utils/delays";

export default function Favorites() {
    const navigation = useNavigation();
    const [loading, setLoading] = useState<boolean>(false);
    const [delays, setDelays] = useState<DelayedStation | []>([]);

    const refresh = async () => {
        setLoading(true);

        const userData = await authModel.getData();
        const allDelays = await getDelays();

        let filteredDelays: [DelayedStation] | [] = [];
        allDelays.map((delay: DelayedStation) => {
            userData.filter((row: { artefact: string }) => {
                const data = row.artefact.replaceAll("'", "");
                const jsonData = JSON.parse(data);

                if (jsonData.station === delay.fromStation.LocationSignature) {
                    filteredDelays.push(delay); // save matching delaystation to array
                }
            });
        });

        setDelays(filteredDelays);

        setLoading(false);
    };

    const isFocused = useIsFocused();
    useEffect(() => {
        isFocused && refresh();
    }, [isFocused]);

    const showDetails = (delay: DelayedStation) => {
        console.log("Navigating to activity:", delay.ActivityId);
        navigation.navigate("DelayDetails", { delay });
    };

    if (loading) {
        <ActivityIndicator color={"white"} />;
    }
    return (
        <View style={styles.container}>
            <View>
                <Text style={styles.title}>Favorites</Text>
            </View>
            <ScrollView refreshControl={<RefreshControl refreshing={loading} onRefresh={refresh} />}>
                <View style={styles.header}>
                    <View style={{ ...styles.row, marginHorizontal: 20 }}>
                        <Text style={{ color: "white", fontSize: 14 }}>Train</Text>
                        <Text style={{ color: "white", marginLeft: "auto" }}>Time</Text>
                    </View>
                </View>
                {delays.map((delay: DelayedStation, index: React.Key | null | undefined) => {
                    const oldTime = new Date(delay.AdvertisedTimeAtLocation);
                    const newTime = new Date(delay.EstimatedTimeAtLocation);
                    return (
                        <Pressable
                            key={index}
                            style={({ pressed }) => ({ opacity: pressed ? 0.5 : 1 })}
                            onPress={() => showDetails(delay)}
                        >
                            <View style={styles.wrapper}>
                                <View style={styles.row}>
                                    <View style={{ flex: 9.5 }}>
                                        <View style={{ ...styles.row, marginBottom: 6 }}>
                                            <View style={styles.pullLeft}>
                                                <View style={{ ...styles.pill, backgroundColor: "#0F324C" }}>
                                                    <Text style={{ fontSize: 14, color: "white" }}>
                                                        {delay.AdvertisedTrainIdent}
                                                    </Text>
                                                </View>
                                                <Text style={{ fontSize: 17, marginStart: 10, color: "white" }}>
                                                    {delay.fromStation.AdvertisedLocationName}
                                                </Text>
                                            </View>
                                            <View style={styles.pullRight}>
                                                <Text
                                                    style={{
                                                        fontSize: 17,
                                                        color: "#c95555",
                                                        textDecorationLine: "line-through",
                                                        textDecorationColor: "gray",
                                                    }}
                                                >
                                                    {oldTime.toLocaleTimeString("sv-SE", {
                                                        hour: "2-digit",
                                                        minute: "2-digit",
                                                    })}
                                                </Text>
                                                {delay.Canceled ? (
                                                    <Text
                                                        style={{
                                                            marginLeft: 5,
                                                            fontSize: 17,
                                                            color: "#ff5252",
                                                            fontWeight: "bold",
                                                        }}
                                                    >
                                                        Cancelled
                                                    </Text>
                                                ) : (
                                                    <Text
                                                        style={{
                                                            fontSize: 17,
                                                            color: "#A3F836",
                                                            fontWeight: "bold",
                                                            marginLeft: 5,
                                                        }}
                                                    >
                                                        {newTime.toLocaleTimeString("sv-SE", {
                                                            hour: "2-digit",
                                                            minute: "2-digit",
                                                        })}
                                                    </Text>
                                                )}
                                            </View>
                                        </View>
                                        <View style={styles.row}>
                                            <View style={styles.pullLeft}>
                                                <Ionicons name="train" size={15} color="white" />
                                                <Text style={{ color: "white", textAlign: "center" }}>SJ Regional</Text>
                                            </View>
                                            <View style={styles.pullRight}>
                                                <View style={styles.pill}>
                                                    <Text style={{ color: "white", textAlign: "center" }}>
                                                        Track {Math.floor(Math.random() * 100) + 1}
                                                    </Text>
                                                </View>
                                            </View>
                                        </View>
                                    </View>
                                    <View style={{ flex: 1 / 2 }}>
                                        <View style={{ flex: 1, justifyContent: "center" }}>
                                            <Ionicons name="chevron-forward" size={24} color="white" />
                                        </View>
                                    </View>
                                </View>
                            </View>
                        </Pressable>
                    );
                })}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 0,
    },
    title: {
        fontSize: 48,
        fontWeight: "bold",
        color: "white",
        padding: 10,
    },
    text: {
        fontSize: 20,
        color: "white",
    },
    label: {
        fontSize: 20,
        fontWeight: "bold",
        color: "white",
    },
    separator: {
        marginVertical: 30,
        height: 1,
        width: "80%",
    },
    wrapper: {
        flex: 1,
        marginHorizontal: 10,
        padding: 15,
        borderBottomColor: "#666",
        borderBottomWidth: 1,
    },
    column: {
        flex: 1,
        flexDirection: "column",
        justifyContent: "center",
    },
    row: {
        flex: 1,
        flexDirection: "row",
    },
    header: {
        flexDirection: "row",
    },
    pullLeft: {
        flex: 1,
        flexDirection: "row",
        justifyContent: "flex-start",
    },
    pullRight: {
        flex: 1,
        flexDirection: "row",
        justifyContent: "flex-end",
    },
    pill: {
        backgroundColor: "#1F6398",
        borderRadius: 5,
        padding: 3,
    },
});
