import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { useTheme } from "../contexts/ThemeContext";
import { styles } from "../styles/HomeStyles";
import { CardShortCut } from "../components/CardShortCut";

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

    return (
        <View style={[styles.container, { backgroundColor: theme.colors.background, }]}>
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
        </View>
    )
}