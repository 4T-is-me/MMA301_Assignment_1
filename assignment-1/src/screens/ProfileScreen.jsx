import React, { useLayoutEffect } from "react";
import {
    View,
    Text,
    TouchableOpacity,
} from "react-native";

import { useTheme } from "../contexts/themeContext";
import { Ionicons } from "@expo/vector-icons";
import { styles } from "../styles/ProfileStyles";
import { CardShortCut } from "../components/CardShortCut";

export default function ProfileScreen({ navigation }) {
    const { theme } = useTheme();

    useLayoutEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <TouchableOpacity
                    onPress={() => navigation.navigate("Settings")}
                    style={[ styles.headerRight, { backgroundColor: theme.colors.primaryLight, }, ]} >
                    <Ionicons name="settings-outline" size={22} color={theme.colors.primary} />
                </TouchableOpacity>
            ),
        });
    }, [navigation, theme]);

    return (
        <View style={[ styles.container, { backgroundColor: theme.colors.background, }, ]} >
            {/* Profile */}
            <View style={[ styles.profileCard, { backgroundColor: theme.colors.card,  borderColor: theme.colors.border, },  ]}  >
                {/* Avatar */}
                <View style={[styles.avatarContainer, {backgroundColor: theme.colors.primaryLight, borderColor: theme.colors.border, }, ]}>
                    <Text style={[ styles.avatarText, {color: theme.colors.primary},]}>
                        NA
                    </Text>
                </View>

                {/* Name */}
                <Text  style={[ styles.name, { color: theme.colors.text,  }, ]} >
                    Nguyễn Văn A
                </Text>

                {/* Username */}
                <Text style={[styles.username,{ color: theme.colors.primary, },]}>
                    @nguyenvana
                </Text>

                {/* Bio */}
                <Text  style={[  styles.bio, {  color: theme.colors.subText}, ]} >
                    Đam mê phát triển ứng dụng mobile.
                    {"\n"}
                    Mỗi ngày học thêm một điều mới.
                </Text>

                {/* Edit Profile */}
                <TouchableOpacity style={[ styles.editBtn, {  backgroundColor: theme.colors.primary}, ]}
                    onPress={() => navigation.navigate("EditProfile") }
                >
                    <Ionicons   name="create-outline" size={17}  color="#FFF" />
                    <Text style={styles.editBtnText}>  Edit Profile </Text>
                </TouchableOpacity>
            </View>

            <View style={styles.shortCut}>
                <CardShortCut title="Settings" description="Customize your app preferences"iconName="settings-outline" onPress={() => navigation.navigate("Settings")}/>
            </View>

        </View>
    );
}