import React, { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import MapView, { Marker, Circle } from "react-native-maps";
import * as Location from "expo-location";
import { useNavigation } from "@react-navigation/native";
import { showMessage } from "react-native-flash-message";

import trafficModel from "../models/traffic";
import { DelayedStation } from "../types";

export default function Home() {
    const [loading, setLoading] = useState<boolean>(false);
    const [loadingMsg, setLoadingMsg] = useState<string>("");
    const [myLocation, setMyLocation] = useState({ coords: { latitude: 56.1612, longitude: 15.5869, accuracy: 1 } });
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
        setMyLocation(gpsLocation);
        console.log("Got gps location with accuracy", gpsLocation.coords.accuracy);
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

    const fetchStations = async () => {
        const response = await trafficModel.getStations();
        return response;
    };

    const fetchDelays = async () => {
        const response = await trafficModel.getDelays();
        return response;
    };

    const setupStations = async () => {
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
        setStationCoords(fixedArray);
    };

    useEffect(() => {
        const init = async () => {
            setLoading(true);
            setLoadingMsg("Getting your location...");
            await getMyLocation();
            setLoadingMsg("Loading markers...");
            await setupStations();
            setLoading(false);
        };
        init();
    }, []);

    if (loading)
        return (
            <View style={{ flex: 1, justifyContent: "center" }}>
                <ActivityIndicator size={"large"} color={"white"} />
                <Text style={styles.title}>{loadingMsg}</Text>
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
                        latitudeDelta: 0.2,
                        longitudeDelta: 0.2,
                    }}
                >
                    {stationCoords.map((obj: DelayedStation, index: React.Key | null | undefined) => {
                        const jsonCoords = obj.Geometry.WGS84;
                        const coords = obj.Geometry.WGS84.substring(7, jsonCoords.length - 1).split(" ");
                        const latitude = parseFloat(coords[1]);
                        const longitude = parseFloat(coords[0]);

                        return (
                            <Marker
                                key={index}
                                coordinate={{ latitude, longitude }}
                                title={obj.AdvertisedLocationName}
                                description={obj.AdvertisedTrainIdent}
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
