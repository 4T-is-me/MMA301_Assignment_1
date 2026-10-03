import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../contexts/ThemeContext";
export default function CardItem({item, isLiked, likesCount, toggleLike}) {
    const { theme } = useTheme();
    return (
        <View style={[styles.card, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
            <View style={styles.cardHeader}>
            <Text style={[styles.cardTitle, { color: theme.colors.text }]}>{item.title}</Text>
            </View>

            <Text style={[styles.cardBody, { color: theme.colors.subText }]} numberOfLines={3}>
            {item.body}
            </Text>

            {/* Tags */}
            <View style={styles.tagsRow}>
            {item.tags?.map((tag, idx) => (
                <View key={idx} style={[styles.tagBadge, { backgroundColor: theme.colors.inputBg }]}>
                <Text style={[styles.tagText, { color: theme.colors.primary }]}>#{tag}</Text>
                </View>
            ))}
            </View>

            {/* Footer Actions */}
            <View style={styles.cardFooter}>
            <TouchableOpacity
                style={styles.actionBtn}
                onPress={() => toggleLike(item.id)}
                activeOpacity={0.7}
            >
                <Ionicons
                name={isLiked ? 'heart' : 'heart-outline'}
                size={20}
                color={isLiked ? '#FF3B30' : theme.colors.subText}
                />
                <Text style={[styles.actionText, { color: isLiked ? '#FF3B30' : theme.colors.subText }]}>
                {likesCount} Likes
                </Text>
            </TouchableOpacity>

            <View style={styles.viewsContainer}>
                <Ionicons name="eye-outline" size={18} color={theme.colors.subText} />
                <Text style={[styles.actionText, { color: theme.colors.subText }]}>
                {item.views || 0} Views
                </Text>
            </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    card: {
        padding: 16,
        borderRadius: 12,
        marginBottom: 12,
        borderWidth: 1,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 3,
    },
    cardHeader: { marginBottom: 6 },
    cardTitle: { fontSize: 16, fontWeight: 'bold', textTransform: 'capitalize' },
    cardBody: { fontSize: 14, lineHeight: 20, marginBottom: 10 },
    tagsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 12 },
    tagBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
    tagText: { fontSize: 11, fontWeight: '600' },
    cardFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderTopWidth: StyleSheet.hairlineWidth,
        borderTopColor: '#CCC',
        paddingTop: 10,
    },
    actionBtn: { flexDirection: 'row', alignItems: 'center', gap: 6 },
    viewsContainer: { flexDirection: 'row', alignItems: 'center', gap: 6 },
    actionText: { fontSize: 13, fontWeight: '500' },
})