import { View, Text, TextInput, Button } from "react-native";
import { StackActions, useNavigation } from "@react-navigation/native";

import { Typography, Forms, Base } from "../styles";

export default function AuthFields({ auth, setAuth, title, submit }) {
    const navigation = useNavigation();

    return (
        <View style={Base.base}>
            <Text style={Typography.header1}>{title}</Text>
            <Text style={Typography.label}>Email</Text>
            <TextInput
                style={Forms.input}
                onChangeText={(content: string) => {
                    setAuth({ ...auth, email: content });
                }}
                value={auth?.email}
                keyboardType="email-address"
            />
            <Text style={Typography.label}>Password</Text>
            <TextInput
                style={Forms.input}
                onChangeText={(content: string) => {
                    setAuth({ ...auth, password: content });
                }}
                value={auth?.password}
                secureTextEntry={true}
            />
            <View style={Forms.button}>
                <Button
                    title={title}
                    onPress={() => {
                        submit();
                    }}
                />
            </View>
            {title === "Login" && (
                <Button
                    title="Register New Account"
                    onPress={() => {
                        navigation.navigate("Register");
                    }}
                />
            )}
            {title === "Register" && (
                <Button
                    title="Back to Login"
                    onPress={() => {
                        navigation.dispatch(StackActions.popToTop());
                    }}
                />
            )}
        </View>
    );
}
