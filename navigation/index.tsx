import React, { useEffect, useState } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer, DarkTheme, useIsFocused } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Pressable } from "react-native";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import Ionicons from "@expo/vector-icons/Ionicons";

import Colors from "../constants/Colors";
import authModel from "../models/auth";

import Delays from "../screens/Delays";
import Auth from "../screens/Auth";
import SettingsModal from "../screens/SettingsModal";
import NotFoundScreen from "../screens/NotFoundScreen";
import Favorites from "../screens/Favorites";
import Map from "../screens/Map";
import DelayDetails from "../screens/DelayDetails";

export default function Navigation() {
    return (
        <NavigationContainer theme={DarkTheme}>
            <RootNavigator />
        </NavigationContainer>
    );
}

const Stack = createNativeStackNavigator();

function RootNavigator() {
    return (
        <Stack.Navigator>
            <Stack.Screen name="Root" component={BottomTabNavigator} options={{ headerShown: false }} />
            <Stack.Screen name="NotFound" component={NotFoundScreen} options={{ title: "Oops!" }} />
            <Stack.Group screenOptions={{ presentation: "modal" }}>
                <Stack.Screen name="Modal" component={SettingsModal} />
            </Stack.Group>
            <Stack.Screen name="DelayDetails" component={DelayDetails} />
        </Stack.Navigator>
    );
}

const BottomTab = createBottomTabNavigator();

function BottomTabNavigator() {
    const routeIcons: any = {
        Home: "home",
        Auth: "enter",
        Favorites: "star",
        Map: "map",
        Delays: "time",
    };
    const [isLoggedIn, setIsLoggedIn] = useState<Boolean>(false);

    const setLoggedIn = async () => {
        setIsLoggedIn(await authModel.loggedIn());
    };

    useEffect(() => {
        setLoggedIn();
    }, []);

    const isFocused = useIsFocused();
    useEffect(() => {
        isFocused && setLoggedIn();
    }, [isFocused]);

    return (
        <BottomTab.Navigator
            initialRouteName="TabOne"
            screenOptions={({ route }) => ({
                tabBarActiveTintColor: Colors.tint,
                tabBarIcon: ({ color, size }) => {
                    const iconName = routeIcons[route.name] || "alert";
                    return <Ionicons name={iconName} size={size} color={color} style={{ marginBottom: -3 }} />;
                },
            })}
        >
            <BottomTab.Screen
                name="Delays"
                component={Delays}
                options={({ navigation }) => ({
                    headerRight: () => (
                        <Pressable
                            onPress={() => navigation.navigate("Modal")}
                            style={({ pressed }) => ({
                                opacity: pressed ? 0.5 : 1,
                            })}
                        >
                            <Ionicons name="cog" size={25} color={Colors.text} style={{ marginRight: 15 }} />
                        </Pressable>
                    ),
                })}
            />
            <BottomTab.Screen
                name="Map"
                component={Map}
                options={() => ({
                    // headerShown: false,
                })}
            />
            {isLoggedIn ? (
                <BottomTab.Screen
                    name="Favorites"
                    component={Favorites}
                    options={() => ({
                        // headerShown: false,
                    })}
                />
            ) : (
                <BottomTab.Screen
                    name="Auth"
                    options={() => ({
                        headerShown: false,
                        title: "Login",
                    })}
                >
                    {() => <Auth setIsLoggedIn={setIsLoggedIn} />}
                </BottomTab.Screen>
            )}
        </BottomTab.Navigator>
    );
}

/**
 * You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
 */
function TabBarIcon(props: { name: React.ComponentProps<typeof FontAwesome>["name"]; color: string }) {
    return <FontAwesome size={30} style={{ marginBottom: -3 }} {...props} />;
}
