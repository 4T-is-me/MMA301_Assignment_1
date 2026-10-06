import React, { useLayoutEffect } from "react";
import { View, Text, TouchableOpacity, Image, } from "react-native";

import { useTheme } from "../contexts/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import { styles } from "../styles/ProfileStyles";
import { CardShortCut } from "../components/CardShortCut";
import { useProfile } from "../contexts/ProfileContext";

export default function ProfileScreen({ navigation }) {
    const { theme } = useTheme();
    const { profile } = useProfile();

    useLayoutEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <TouchableOpacity
                    onPress={() => navigation.navigate("Settings")}
                    style={[styles.headerRight, { backgroundColor: theme.colors.primaryLight, },]} >
                    <Ionicons name="settings-outline" size={22} color={theme.colors.primary} />
                </TouchableOpacity>
            ),
        });
    }, [navigation, theme]);

    return (
        <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <View style={[styles.profileCard, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
                <View style={[styles.avatarContainer, { backgroundColor: theme.colors.primaryLight, borderColor: theme.colors.border }]}>
                    <Image source={{ uri: profile.avatar }} style={[styles.avatarImage, { borderRadius: 18 }]} />
                </View>

                <Text style={[styles.name, { color: theme.colors.text }]}>
                    {profile.name}
                </Text>

                <Text style={[styles.username, { color: theme.colors.primary }]}>
                    {profile.email}
                </Text>

                {(profile.phone || profile.location) && (
                    <View style={{ marginVertical: 4, alignItems: 'center', gap: 2 }}>
                        {profile.phone ? (
                            <Text style={{ fontSize: 13, color: theme.colors.subText }}>
                                {profile.phone}
                            </Text>
                        ) : null}
                        {profile.location ? (
                            <Text style={{ fontSize: 13, color: theme.colors.subText }}>
                                {profile.location}
                            </Text>
                        ) : null}
                    </View>
                )}

                <Text style={[styles.bio, { color: theme.colors.subText }]}>
                    {profile.bio}
                </Text>

                <TouchableOpacity style={[styles.editBtn, { backgroundColor: theme.colors.primary }]} onPress={() => navigation.navigate("EditProfile")}>
                    <Ionicons name="create-outline" size={17} color="#FFF" />
                    <Text style={styles.editBtnText}>Edit Profile</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.shortCut}>
                <CardShortCut title="Settings" description="Customize your app preferences" iconName="settings-outline" onPress={() => navigation.navigate("Settings")} />
            </View>

        </View>
    );
}


