import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    headerRight: {
        width: 42,
        height: 42,
        borderRadius: 12,
        justifyContent: "center",
        alignItems: "center",
        marginRight: 16,
    },

    container: {
        flex: 1,
        paddingHorizontal: 20,
        paddingTop: 20,
    },

    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },

    profileCard: {
        alignItems: "center",
        paddingVertical: 28,
        paddingHorizontal: 20,
        borderRadius: 22,
        borderWidth: 1,
    },

    avatarContainer: {
        width: 96,
        height: 96,
        borderRadius: 18,
        borderWidth: 2,
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 16,
    },

    avatarText: {
        fontSize: 28,
        fontWeight: "700",
    },
    avatarImage: {
        width: "100%",
        height: "100%",
        borderRadius: 18,
    },

    name: {
        fontSize: 22,
        fontWeight: "700",
        marginBottom: 4,
    },
    

    username: {
        fontSize: 12,
        marginBottom: 12,
    },

    bio: {
        fontSize: 13,
        lineHeight: 19,
        textAlign: "center",
        maxWidth: "85%",
        marginBottom: 20,
    },

    editBtn: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 11,
        paddingHorizontal: 18,
        borderRadius: 12,
        gap: 6,
    },

    editBtnText: {
        color: "#FFF",
        fontWeight: "600",
        fontSize: 13,
    },
    shortCut: {
        marginTop: 15,
    }
});