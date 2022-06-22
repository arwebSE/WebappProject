import React, { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { ActivityIndicator, RefreshControl, ScrollView, StyleSheet, Text, View } from "react-native";
import { DefaultTheme, DataTable, Provider as PaperProvider } from "react-native-paper";

import trafficModel from "../models/traffic";
import { DelayedStation } from "../types";

export default function Home() {
    const navigation = useNavigation();
    const [loading, setLoading] = useState<boolean>(false);
    const [stations, setStations] = useState<DelayedStation | []>([]);

    const fetchStations = async () => {
        const response = await trafficModel.getStations();
        return response;
    };

    const fetchDelays = async () => {
        const response = await trafficModel.getDelays();
        return response;
    };

    const initSetup = async () => {
        setLoading(true);
        const stations = await fetchStations();
        const delays = await fetchDelays();

        const delaysHasLocation = delays.filter((element: any) => {
            return element.FromLocation !== undefined;
        });

        const stationDelays = stations.map((station: { LocationSignature: string }) => {
            const delay = delaysHasLocation.find((delay: { FromLocation: { LocationName: string }[] }) => {
                if (delay.FromLocation[0].LocationName === station.LocationSignature) {
                    return delay;
                }
            });

            if (delay) {
                const delayStation = { ...delay, ...station };
                return delayStation;
            }
        });

        const fixedArray = stationDelays.filter((element: any) => {
            return element !== undefined;
        });

        //console.log("first stationdelay", fixedArray[0]);

        setStations(fixedArray);
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
        <ActivityIndicator />;
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

                        {stations.map((station, index) => {
                            const oldTime = new Date(station.AdvertisedTimeAtLocation);
                            const newTime = new Date(station.EstimatedTimeAtLocation);

                            return (
                                <View style={styles.row} key={index}>
                                    <DataTable.Row style={styles.dataRow}>
                                        <DataTable.Cell style={{ flex: 2 }}>
                                            {station.AdvertisedLocationName}
                                        </DataTable.Cell>
                                        <DataTable.Cell>
                                            <Text style={{ fontSize: 17 }}>{station.AdvertisedTrainIdent}</Text>
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
                                </View>
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
