import React, { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { ActivityIndicator, Pressable, RefreshControl, ScrollView, StyleSheet, Text, View } from "react-native";
import { DefaultTheme, DataTable, Provider as PaperProvider } from "react-native-paper";

import { DelayedStation, Station } from "../types";
import getDelays from "../utils/delays";

export default function Home() {
    const navigation = useNavigation();
    const [loading, setLoading] = useState<boolean>(false);
    const [delays, setDelays] = useState<DelayedStation | []>([]);

    const initSetup = async () => {
        setLoading(true);
        const res = await getDelays();
        setDelays(res);
        setLoading(false);
    };

    useEffect(() => {
        initSetup();
    }, []);

    const theme = {
        ...DefaultTheme,
        roundness: 2,
        colors: {
            ...DefaultTheme.colors,
            primary: "#2c3e50",
            accent: "#f1c40f",
            text: "white",
        },
        dark: true,
    };

    if (loading) {
        <ActivityIndicator color={"white"} />;
    }
    return (
        <View style={styles.container}>
            <View>
                <Text style={styles.title}>Delays</Text>
            </View>
            <ScrollView refreshControl={<RefreshControl refreshing={loading} onRefresh={initSetup} />}>
                <PaperProvider theme={theme}>
                    <DataTable>
                        <DataTable.Header style={styles.dataRow}>
                            <DataTable.Title style={{ flex: 2 }}>
                                <Text style={{ fontSize: 14 }}>Station</Text>
                            </DataTable.Title>
                            <DataTable.Title>
                                <Text style={{ fontSize: 14 }}>Train №</Text>
                            </DataTable.Title>
                            <View style={{ flexDirection: "row", flexBasis: "30%" }}>
                                <DataTable.Title>Old ETA</DataTable.Title>
                                <DataTable.Title style={{ justifyContent: "flex-end" }}>New ETA</DataTable.Title>
                            </View>
                        </DataTable.Header>

                        {delays.map((delay: DelayedStation, index: React.Key | null | undefined) => {
                            const oldTime = new Date(delay.AdvertisedTimeAtLocation);
                            const newTime = new Date(delay.EstimatedTimeAtLocation);

                            return (
                                <Pressable key={index} style={({ pressed }) => ({ opacity: pressed ? 0.5 : 1 })}>
                                    {delay.Canceled ? (
                                        <View
                                            style={{
                                                borderBottomColor: "red",
                                                borderBottomWidth: 2,
                                                top: -25,
                                                marginHorizontal: 10,
                                            }}
                                        />
                                    ) : null}
                                    <DataTable.Row style={styles.dataRow}>
                                        <DataTable.Cell style={{ flex: 2 }}>
                                            {delay.fromStation.AdvertisedLocationName}
                                        </DataTable.Cell>
                                        <DataTable.Cell>
                                            <Text style={{ fontSize: 17 }}>{delay.AdvertisedTrainIdent}</Text>
                                        </DataTable.Cell>

                                        <View style={{ flexDirection: "row", flexBasis: "30%" }}>
                                            <DataTable.Cell>
                                                <Text style={{ fontSize: 17, color: "#FF7777" }}>
                                                    {oldTime.toLocaleTimeString("sv-SE", {
                                                        hour: "2-digit",
                                                        minute: "2-digit",
                                                    })}
                                                </Text>
                                            </DataTable.Cell>
                                            <DataTable.Cell style={{ justifyContent: "flex-end" }}>
                                                <Text style={{ fontSize: 17, color: "lightgreen" }}>
                                                    {newTime.toLocaleTimeString("sv-SE", {
                                                        hour: "2-digit",
                                                        minute: "2-digit",
                                                    })}
                                                </Text>
                                            </DataTable.Cell>
                                        </View>
                                    </DataTable.Row>
                                </Pressable>
                            );
                        })}
                    </DataTable>
                </PaperProvider>
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
    dataRow: {
        flex: 1,
    },
});
