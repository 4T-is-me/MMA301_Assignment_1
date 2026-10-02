import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { useTheme } from "../contexts/ThemeContext";
import { styles } from "../styles/EditProfileStyles";

export default function EditProfileScreen({ navigation }) {
    const { theme } = useTheme();
    return (
        <View style={[ styles.container, { backgroundColor: theme.colors.background, }, ]} >
            <Text style={[ styles.title, { color: theme.colors.text, }, ]} >Edit Profile Screen</Text>
        </View>
    )
}