import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginHorizontal: 16,
    },

    cardContainer: {
        height: 155,
        borderRadius: 22,
        overflow: "hidden",
        position: "relative",
        marginTop: 16,
        borderWidth: 1,
    },

    content: {
        flex: 1,
        justifyContent: "center",
        paddingHorizontal: 22,
        paddingVertical: 18,
        zIndex: 2,
    },

    date: {
        fontSize: 10,
        fontWeight: "700",
        letterSpacing: 1.2,
        marginBottom: 8,
    },

    title: {
        fontSize: 22,
        fontWeight: "700",
        marginBottom: 7,
    },

    description: {
        fontSize: 12,
        lineHeight: 18,
        maxWidth: "72%",
    },

    // Decorative circles
    circleLarge: {
        position: "absolute",
        width: 130,
        height: 130,
        borderRadius: 65,
        right: -38,
        top: -42,
        opacity: 0.08,
    },

    circleSmall: {
        position: "absolute",
        width: 70,
        height: 70,
        borderRadius: 35,
        right: 20,
        bottom: 8,
        opacity: 0.07,
    },
    
    shortCut: {
        marginTop: 24,
        gap: 4,
    },

    shortCutSubText: {
        fontSize: 12,
        fontWeight: "500",
        marginBottom: 2,
    },

    shortCutText: {
        fontSize: 20,
        fontWeight: "700",
        marginBottom: 8,
    },
});