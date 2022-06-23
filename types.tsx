/**
 * Learn more about using TypeScript with React Navigation:
 * https://reactnavigation.org/docs/typescript/
 */

import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { CompositeScreenProps, NavigatorScreenParams } from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

declare global {
    namespace ReactNavigation {
        interface RootParamList extends RootStackParamList {}
    }
}

export type RootStackParamList = {
    Root: NavigatorScreenParams<RootTabParamList> | undefined;
    Modal: undefined;
    NotFound: undefined;
    Login: undefined;
    Register: undefined;
};

export type RootStackScreenProps<Screen extends keyof RootStackParamList> = NativeStackScreenProps<
    RootStackParamList,
    Screen
>;

export type RootTabParamList = {
    TabOne: undefined;
    TabTwo: undefined;
};

export type RootTabScreenProps<Screen extends keyof RootTabParamList> = CompositeScreenProps<
    BottomTabScreenProps<RootTabParamList, Screen>,
    NativeStackScreenProps<RootStackParamList>
>;

interface Auth {
    api_key: string;
    email: string;
    password: string;
}

export type Location = {
    LocationName: string;
    Priority: number;
    Order: number;
};

export type LocationObject = {
    coords: {
        accuracy: number;
        altitude: number;
        altitudeAccuracy: number;
        heading: number;
        latitude: number;
        longitude: number;
        speed: number;
    };
    timestamp: number;
};

export type Station = {
    AdvertisedLocationName: string;
    Geometry: { WGS84: string };
    LocationSignature: string;
    PlatformLine: [string];
};

export type DelayedStation = {
    ActivityId: string;
    ActivityType: string;
    AdvertisedTimeAtLocation: string;
    AdvertisedTrainIdent: string;
    Canceled: boolean;
    EstimatedTimeAtLocation: string;
    FromLocation: [Location];
    ToLocation: [Location];
    fromStation: Station;
    toStation: Station;
    length: number;
    map: Function;
};
