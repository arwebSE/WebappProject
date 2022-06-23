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

export type DelayedStation = {
    AdvertisedLocationName: string;
    FromLocation: { LocationName: string };
    AdvertisedTimeAtLocation: string;
    EstimatedTimeAtLocation: string;
    AdvertisedTrainIdent: string;
    ToLocation: { LocationName: string };
    Canceled: boolean;
    Geometry: { WGS84: string };
};
