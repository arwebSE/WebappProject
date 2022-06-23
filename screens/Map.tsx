import React, { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import MapView, { Marker, Circle } from "react-native-maps";
import * as Location from "expo-location";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import { showMessage } from "react-native-flash-message";

import { DelayedStation, Station, LocationObject } from "../types";
import getDelays from "../utils/delays";

export default function Home() {
    const [loading, setLoading] = useState<boolean>(false);
    const [loadingMsg, setLoadingMsg] = useState<string>("");
    const [myLocation, setMyLocation] = useState<LocationObject | {}>({
        coords: { latitude: 56.1612, longitude: 15.5869, accuracy: 1 },
    });
    const [myMarker, setMyMarker] = useState<Marker | {}>({});
    const [stationCoords, setStationCoords] = useState<DelayedStation | []>([]);

    const getMyLocation = async () => {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
            console.log("Permission to access location was denied");
            showMessage({
                message: "Permission denied",
                description: "Permission to access location was denied.",
                type: "warning",
            });
            return;
        }
        const gpsLocation = await Location.getCurrentPositionAsync({});
        if (gpsLocation) setMyLocation(gpsLocation);

        console.log(`GPS accuracy: ${gpsLocation.coords.accuracy}.`);
        setMyMarker(
            <Marker
                coordinate={{
                    latitude: gpsLocation.coords.latitude,
                    longitude: gpsLocation.coords.longitude,
                }}
                title="My Location"
                pinColor="blue"
            />
        );
    };

    const setupStations = async () => {
        const res = await getDelays();
        setStationCoords(res);
    };

    const refreshMap = async () => {
        setLoading(true);
        setLoadingMsg("Getting your location...");
        console.log("Getting device location...");
        await getMyLocation();
        setLoadingMsg("Loading markers...");
        console.log("Loading stations...");
        await setupStations();
        console.log(stationCoords.length, "stations loaded.");
        setLoading(false);
    };

    const isFocused = useIsFocused();
    useEffect(() => {
        isFocused && refreshMap();
    }, [isFocused]);

    if (loading)
        return (
            <View style={{ flex: 1, justifyContent: "center" }}>
                <ActivityIndicator size={"large"} color={"white"} />
                <Text style={styles.text}>{loadingMsg}</Text>
            </View>
        );
    return (
        <View style={{ flex: 1 }}>
            <Text style={styles.title}>Delay Map</Text>
            <View style={styles.container}>
                <MapView
                    style={styles.map}
                    initialRegion={{
                        ...myLocation?.coords,
                        latitudeDelta: 3,
                        longitudeDelta: 3,
                    }}
                >
                    {stationCoords.map((delay: DelayedStation, index: React.Key | null | undefined) => {
                        const jsonCoords = delay.fromStation.Geometry.WGS84;
                        const coords = delay.fromStation.Geometry.WGS84.substring(7, jsonCoords.length - 1).split(" ");
                        const latitude = parseFloat(coords[1]);
                        const longitude = parseFloat(coords[0]);
                        const oldTime = new Date(delay.AdvertisedTimeAtLocation);
                        const newTime = new Date(delay.EstimatedTimeAtLocation);
                        const oldTimeString = oldTime.toLocaleTimeString("sv-SE", {
                            hour: "2-digit",
                            minute: "2-digit",
                        });
                        const newTimeString = newTime.toLocaleTimeString("sv-SE", {
                            hour: "2-digit",
                            minute: "2-digit",
                        });
                        const isCancelled = delay.Canceled ? "(😢CANCELLED)" : "";

                        return (
                            <Marker
                                key={index}
                                coordinate={{ latitude, longitude }}
                                title={`${delay.fromStation.AdvertisedLocationName} to ${delay.toStation.AdvertisedLocationName}. ${isCancelled}`}
                                description={`Train ${delay.AdvertisedTrainIdent}. ETA was ${oldTimeString}, new ETA is ${newTimeString}.`}
                            />
                        );
                    })}
                    {/* {myMarker} */}
                    {/* <Circle center={myLocation?.coords} radius={100} fillColor="rgba(158, 158, 255, 0.5)" /> */}
                </MapView>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "flex-end",
    },
    title: {
        fontSize: 48,
        fontWeight: "bold",
        color: "white",
        padding: 10,
    },
    text: {
        fontSize: 20,
        fontWeight: "bold",
        color: "white",
        textAlign: "center",
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
    map: {
        ...StyleSheet.absoluteFillObject,
        borderColor: "white",
    },
});
