import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    container: { flex: 1 },
    searchContainer: {
        paddingHorizontal: 16,
        paddingBottom: 8,
        position: 'relative',
        justifyContent: 'center',
    },
    searchIcon: { position: 'absolute', left: 28, zIndex: 1 },
    searchInput: {
        height: 44,
        borderRadius: 22,
        paddingLeft: 42,
        paddingRight: 36,
        borderWidth: 1,
        fontSize: 14,
    },
    clearBtn: { position: 'absolute', right: 28, zIndex: 1 },
    filterContainer: { marginBottom: 8 },
    filterChip: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        marginRight: 8,
        borderWidth: 1,
    },
    filterChipText: { fontSize: 12 },
    loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    loadingText: { marginTop: 10, fontSize: 14 },
    footerLoader: { paddingVertical: 16, alignItems: 'center' },
    emptyContainer: { alignItems: 'center', justifyContent: 'center', paddingVertical: 60, paddingHorizontal: 20 },
    emptyTitle: { fontSize: 18, fontWeight: 'bold', marginTop: 12 },
    emptySub: { fontSize: 14, textAlign: 'center', marginTop: 6 },
});
