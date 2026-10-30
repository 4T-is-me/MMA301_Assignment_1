// Author: trangtttce191027
import React, { useEffect, useState } from "react";
import { View, Text, Image, TouchableOpacity, FlatList, ActivityIndicator, ScrollView } from "react-native";
import { useTheme } from "../contexts/ThemeContext";
import { styles } from "../styles/HomeStyles";
import { CardShortCut } from "../components/CardShortCut";
import CardItem from "../components/CardItem";
import { fetchActivities } from "../services/activityService";

export default function HomeScreen({ navigation }) {
    const { theme } = useTheme();

    const currentDate = new Date();
    const formattedDate = currentDate
        .toLocaleDateString("en-US", {
            weekday: "long",
            month: "long",
            day: "numeric",
        })
        .toUpperCase();
    
    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(false);
    const [likedPosts, setLikedPosts] = useState({});
    const fetchData = async () => {
        setLoading(true);
        try {
            const data = await fetchActivities(3, 0); // Lấy 3 bài mới nhất
            setActivities(data.posts || []);
        } catch (error) {
            console.error("Failed to fetch home activities:", error);
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchData();
    }, []);


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
    const renderItem = ({ item }) => {
        const isLiked = !!likedPosts[item.id];
        const likeCount = item.reactions?.likes || 0;
        return (
            <CardItem item={item} isLiked={isLiked} likesCount={likeCount || 0} toggleLike={toggleLiked} />
        )
    }

    

    return (
        <ScrollView style={[styles.container, { backgroundColor: theme.colors.background, }]}>
            <View style={[styles.cardContainer, {backgroundColor: theme.colors.welcomeBg, borderColor: theme.colors.border, }]}>
                {/* Decorative circles */}
                <View style={[styles.circleLarge,{ backgroundColor: theme.colors.primary,}]} />

                <View style={[ styles.circleSmall,  { backgroundColor: theme.colors.primary, } ]} />

                {/* Content */}
                <View style={styles.content}>
                    <Text style={[  styles.date, { color: theme.colors.subText } ]} >
                        {formattedDate}
                    </Text>

                    <Text style={[  styles.title, { color: theme.colors.primary }, ]} >
                        Chào mừng trở lại!
                    </Text>

                    <Text style={[ styles.description, { color: theme.colors.subText }, ]}>
                        Cùng cập nhật hồ sơ và khám phá hoạt động của bạn hôm nay.
                    </Text>
                </View>
            </View>

            {/* shorts cut */}
            <View style={styles.shortCut}>
                <Text style={[styles.shortCutSubText, { color: theme.colors.subText }]}>Lối tắt</Text>
                <Text style={[styles.shortCutText, { color: theme.colors.text }]}>Dành riêng cho bạn</Text>

                <CardShortCut title="Personal Profile" description="Update your personal profile" iconName="person-outline" onPress={() => {navigation.navigate("Profile")}} />
                <CardShortCut title="Activity" description="Explore your recent activities" iconName="accessibility-outline" onPress={() => {navigation.navigate("Activity")}} />
                <CardShortCut title="Settings" description="Customize your app preferences"iconName="settings-outline" onPress={() => navigation.navigate("Settings")}/>
            </View>

            {/* activities - see all => navigation.navigate("Activity") */}
            <View style={{ marginTop: 20, paddingHorizontal: 16 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                    <Text style={{ fontSize: 18, fontWeight: 'bold', color: theme.colors.text }}>
                        Hoạt động gần đây
                    </Text>
                    <TouchableOpacity onPress={() => navigation.navigate("Activity")}>
                        <Text style={{ color: theme.colors.primary, fontWeight: '600', fontSize: 14 }}>
                            Xem tất cả
                        </Text>
                    </TouchableOpacity>
                </View>

                {loading ? (
                    <ActivityIndicator size="small" color={theme.colors.primary} style={{ marginVertical: 20 }} />
                ) : (
                    <FlatList
                        data={activities}
                        keyExtractor={(item) => item.id.toString()}
                        renderItem={renderItem}
                        scrollEnabled={false} // Tắt cuộn của FlatList để ScrollView cha quản lý cuộn
                    />
                )}
            </View>
        </ScrollView>
    )
}