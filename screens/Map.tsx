import React, { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import MapView, { Marker, Circle } from "react-native-maps";
import * as Location from "expo-location";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import { showMessage } from "react-native-flash-message";

import { DelayedStation } from "../types";
import { getDelays } from "../utils/delays";

export default function Map() {
    const navigation = useNavigation();
    const [loading, setLoading] = useState<boolean>(false);
    const [loadingMsg, setLoadingMsg] = useState<string>("");
    const [markers, setMarkers] = useState<[Marker] | []>([]);
    const [initCoords, setInitCoords] = useState({
        coords: { latitude: 5.1612, longitude: 5.5869, accuracy: 1 },
    });

    const getMyLocation = async () => {
        setLoadingMsg("Getting your location...");
        console.log("Getting device location...");
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
        console.log(`GPS accuracy: ${gpsLocation.coords.accuracy}.`);
        return gpsLocation;
    };

    const setupStations = async () => {
        const res = await getDelays();
        console.log(res.length, "stations loaded.");
        return res;
    };

    const setupMarkers = async () => {
        const gps = initCoords;
        const gpsRes = await getMyLocation();
        if (gpsRes) {
            gps.coords = {
                latitude: gpsRes.coords.latitude,
                longitude: gpsRes.coords.longitude,
                accuracy: gpsRes.coords.accuracy,
            };
            setInitCoords(gps);
        }

        setLoadingMsg("Loading stations...");
        console.log("Loading stations...");
        const stationCoords = await setupStations();

        setLoadingMsg("Drawing markers...");
        console.log("Drawing markers...");

        const myMarker = (
            <Marker
                key={"myMarker"}
                coordinate={{
                    latitude: gps.coords.latitude,
                    longitude: gps.coords.longitude,
                }}
                title="My Location"
                pinColor="blue"
            />
        );

        const myCircle = (
            <Circle center={gps.coords} radius={500} fillColor="rgba(158, 158, 255, 0.5)" key={"myCircle"} />
        );

        const stationMarkers = stationCoords.map((delay: DelayedStation, index: React.Key | null | undefined) => {
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
                    image={require("../assets/images/dangerSign.png")}
                    onCalloutPress={() => { showDetails(delay) }}
                />
            );
        });
        const allMarkers: [Marker] = [myMarker, myCircle, ...stationMarkers];
        setMarkers(allMarkers);
    };

    const refreshMap = async () => {
        setLoading(true);
        await setupMarkers();
        setLoading(false);
    };

    const isFocused = useIsFocused();
    useEffect(() => {
        isFocused && refreshMap();
    }, [isFocused]);

    const showDetails = (delay: DelayedStation) => {
        console.log("Navigating to activity:", delay.ActivityId);
        navigation.navigate("DelayDetails", { delay });
    };

    if (loading)
        return (
            <View style={{ flex: 1, justifyContent: "center" }}>
                <ActivityIndicator size={"large"} color={"white"} />
                <Text style={styles.text}>{loadingMsg}</Text>
            </View>
        );
    return (
        <View style={{ flex: 1 }}>
            <View style={styles.container}>
                <MapView
                    style={styles.map}
                    initialRegion={{
                        ...initCoords.coords,
                        latitudeDelta: 3,
                        longitudeDelta: 3,
                    }}
                >
                    {markers}
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
