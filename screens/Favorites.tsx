import React, { useEffect, useState } from "react";
import { Pressable, SafeAreaView, StyleSheet, Text, View } from "react-native";
import { StackActions, useNavigation } from "@react-navigation/native";
import { showMessage } from "react-native-flash-message";

export default function Favorites() {
    const navigation = useNavigation();
    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.title}>favs</Text>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    title: {
        fontSize: 20,
        fontWeight: "bold",
        color: "white",
    },
});
