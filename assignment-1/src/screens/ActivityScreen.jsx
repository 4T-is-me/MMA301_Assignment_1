import React, { useCallback, useEffect, useState } from "react";
import { View, Text, TouchableOpacity, TextInput, FlatList, RefreshControl, ActivityIndicator } from "react-native";
import { useTheme } from "../contexts/ThemeContext";
import { styles } from "../styles/ActivityStyles";
import { Ionicons} from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { fetchActivities, fetchActivitiesByTag } from "../services/activityService";
import CardItem from "../components/CardItem";
export default function ActivityScreen({ navigation }) {
    const { theme } = useTheme();
    const insets = useSafeAreaInsets();
    //state
    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(false);
    const [loadingMore, setLoadingMore] = useState(false);
    const [refreshing, setRefreshing] = useState(false);

    //pagination
    const [skip, setSkip] = useState(0);
    const [total, setTotal] = useState(0);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedTag, setSelectedTag] = useState("All");

    const TAGS = ['All', 'history', 'american', 'crime', 'french', 'fiction', 'magical'];
    const LIMIT = 10;

    //Interaction State
    const [likedPosts, setLikedPosts] = useState({});

    const loadData = useCallback(async (isInitial, currentSkip = 0, query = searchQuery, tag = selectedTag) => {
        if(isInitial) {
            setLoading(true);
        }else {
            setLoadingMore(true);
        }
        try {
            let data;
            if(tag !== "All") {
                data = await fetchActivitiesByTag(tag, LIMIT, currentSkip);
            } else {
                data = await fetchActivities(LIMIT, currentSkip, query);
            }
            

            if(isInitial) {
                setActivities(data.posts || []);
            }else {
                setActivities((prev) => [...prev, ...data.posts])
            }
            setTotal(data.total);
            console.log("......",activities);
        } catch (error) {
            console.error('Failed to load activities', error);
        } finally {
            setLoading(false);
            setLoadingMore(false);
            setRefreshing(false);
        }

    }, [searchQuery, selectedTag])

    useEffect(() => {
        loadData(true, 0, searchQuery, selectedTag);
    }, [loadData, searchQuery, selectedTag])

    //pull to refresh
    const handleRefresh = async () => {
        setRefreshing(true);
        setSkip(0);
        loadData(true, 0, searchQuery, selectedTag);
    }

    // infinite scroll
    const handleLoadMore = async () => {
        if(!loadingMore && activities.length < total) {
            const nextSkip = skip + LIMIT;
            setSkip(nextSkip);
            loadData(false, nextSkip, searchQuery, selectedTag);
        }
    }

    const toggleLiked = async (postId) => {
        setLikedPosts((prev) => ({
            ...prev,
            [postId]: !prev[postId],
        }));
        setActivities((prevList) =>
            prevList.map((item) => {
                if (item.id === postId) {
                    const isLiked = likedPosts[postId];
                    const currentLikes = item.reactions?.likes || 0;
                    return {
                        ...item,
                        reactions: {
                            ...item.reactions,
                            likes: isLiked ? currentLikes - 1 : currentLikes + 1,
                        },
                    }
                }
            return item;
            })
        )
    }

    // Render Item trong FlatList
    const renderItem = ({ item }) => {
        const isLiked = !!likedPosts[item.id];
        const likeCount = item.reactions?.likes || 0;
        return (
            <CardItem item={item} isLiked={isLiked} likesCount={likeCount} toggleLike={toggleLiked} />
        )
    }
    // Empty State
    const renderEmptyList = () => {
        if (loading) return null;
        return (
            <View style={styles.emptyContainer}>
                <Ionicons name="search-outline" size={60} color={theme.colors.subText} />
                <Text style={[styles.emptyTitle, { color: theme.colors.text }]}>No Activities Found</Text>
                <Text style={[styles.emptySub, { color: theme.colors.subText }]}>
                Try searching for another keyword or selecting a different tag.
                </Text>
            </View>
        );
    }

    return (
        <View style={[ styles.container, { paddingTop: insets.top, backgroundColor: theme.colors.background, }, ]} >
            {/* 1. SEARCH BAR */}
            <View style={styles.searchContainer}>
                <Ionicons name="search" size={20} color={theme.colors.subText} style={styles.searchIcon} />
                <TextInput
                    style={[
                        styles.searchInput,
                        { backgroundColor: theme.colors.inputBg, color: theme.colors.text, borderColor: theme.colors.border },
                    ]}
                    placeholder="Search activities & posts..."
                    placeholderTextColor={theme.colors.subText}
                    value={searchQuery}
                    onChangeText={(text) => setSearchQuery(text)}
                    clearButtonMode="while-editing"
                />
                {searchQuery.length > 0 && (
                <TouchableOpacity onPress={() => setSearchQuery('')} style={styles.clearBtn}>
                    <Ionicons name="close-circle" size={18} color={theme.colors.subText} />
                </TouchableOpacity>
                )}
            </View>

            {/* 2. TAG FILTER (Horizontal Scroll) */}
            <View style={styles.filterContainer}>
                <FlatList
                    horizontal
                    data={TAGS}
                    keyExtractor={(item) => item}
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{ paddingHorizontal: 16 }}
                    renderItem={({ item }) => {
                        const isSelected = selectedTag === item;
                        return (
                        <TouchableOpacity
                            style={[ styles.filterChip, {  backgroundColor: isSelected ? theme.colors.primary : theme.colors.inputBg,  borderColor: theme.colors.border, },  ]}
                            onPress={() => setSelectedTag(item)}
                        >
                            <Text  style={[  styles.filterChipText,  { color: isSelected ? '#FFF' : theme.colors.text, fontWeight: isSelected ? 'bold' : 'normal' },   ]}  >
                                {item.toUpperCase()}
                            </Text>
                        </TouchableOpacity>
                        );
                    }}
                />
            </View>

            {/* 3. MAIN FLATLIST */}
            {loading ? (
                <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={theme.colors.primary} />
                <Text style={[styles.loadingText, { color: theme.colors.subText }]}>Loading activities...</Text>
                </View>
            ) : (
                <FlatList
                    data={activities}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={renderItem}
                    contentContainerStyle={{ padding: 16, paddingBottom: 30 }}
                    ListEmptyComponent={renderEmptyList}
                    refreshControl={
                        <RefreshControl  refreshing={refreshing}  onRefresh={handleRefresh}  colors={[theme.colors.primary]} tintColor={theme.colors.primary}/>
                    }
                    onEndReached={handleLoadMore}
                    onEndReachedThreshold={0.5}
                    ListFooterComponent={
                        loadingMore ? (
                        <View style={styles.footerLoader}>
                            <ActivityIndicator size="small" color={theme.colors.primary} />
                        </View>
                        ) : null
                    }
                />
            )}

        </View>
    )
}