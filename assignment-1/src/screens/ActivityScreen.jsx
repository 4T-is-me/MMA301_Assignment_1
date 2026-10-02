import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { useTheme } from "../contexts/ThemeContext";
import { styles } from "../styles/ActivityStyles";
export default function ActivityScreen({ navigation }) {
    const { theme } = useTheme();
    return (
        <View style={[ styles.container, { backgroundColor: theme.colors.background, }, ]} >
            <Text style={[ styles.title, { color: theme.colors.text, }, ]} >Activity Screen</Text>
        </View>
    )
}