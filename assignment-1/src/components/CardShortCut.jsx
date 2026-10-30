// Author: trangtttce191027
import { View, StyleSheet, TouchableOpacity, Text } from "react-native";
import { useTheme } from "../contexts/ThemeContext";
import { Ionicons } from "@expo/vector-icons";

export const CardShortCut = ({ title, description, iconName, onPress }) => {
    const { theme } = useTheme();
    return (
        <TouchableOpacity onPress={onPress} style={[styles.shortCut, {backgroundColor: theme.colors.card}]}>
            <View style={[styles.shortCutIcon, { backgroundColor: theme.colors.primaryLight, borderColor: theme.colors.border, }]}>
                <Ionicons name={iconName} size={24} color={theme.colors.primary} />
            </View>

            <View style={styles.shortCutContent}>
                <Text style={[styles.shortCutText, { color: theme.colors.text }]}>{title}</Text>
                <Text style={[styles.shortCutSubText, { color: theme.colors.subText }]}>{description}</Text>
            </View>

            <Ionicons name="chevron-forward-outline" size={24} color={theme.colors.text} />
        </TouchableOpacity>
    )



}

const styles = StyleSheet.create({
    shortCut: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderRadius: 16,
        marginVertical: 3,
        gap: 16,
        backgroundColor: "#",
    },
    shortCutIcon: {
        width: 45,
        height: 45,
        borderRadius: 10,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#F8F9FA",
        borderWidth: 1,
        borderColor: "#E9ECEF",
    },
    shortCutContent: {
        flex: 1,
        justifyContent: "center",
        gap: 8,
        flexDirection: "column",
        alignItems: "flex-start",
        paddingHorizontal: 10,
    },
    shortCutText: {
        fontSize: 14,
        fontWeight: "600",
    },
    shortCutSubText: {
        fontSize: 12,
    }
})