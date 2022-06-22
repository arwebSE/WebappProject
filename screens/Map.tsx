import React, { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import MapView, { Marker, Circle } from "react-native-maps";
import * as Location from "expo-location";
import { useNavigation } from "@react-navigation/native";
import { showMessage } from "react-native-flash-message";

export default function Home() {
    const [loading, setLoading] = useState<boolean>(false);
    const [loadingMsg, setLoadingMsg] = useState<string>("");
    const [myLocation, setMyLocation] = useState({ coords: { latitude: 56.1612, longitude: 15.5869, accuracy: 1 } });
    const [myMarker, setMyMarker] = useState<Marker | {}>({});

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

    useEffect(() => {
        const init = async () => {
            setLoading(true);
            setLoadingMsg("Getting your location...");
            await getMyLocation();
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
            <Text style={styles.title}>Skicka order</Text>
            <View style={styles.container}>
                <MapView
                    style={styles.map}
                    initialRegion={{
                        ...myLocation?.coords,
                        latitudeDelta: 0.2,
                        longitudeDelta: 0.2,
                    }}
                >
                    <>
                        {myMarker}
                        <Circle
                            center={myLocation?.coords}
                            radius={100}
                            color="rgba(158, 158, 255, 1.0)"
                            fillColor="rgba(158, 158, 255, 0.3)"
                        />
                    </>
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
