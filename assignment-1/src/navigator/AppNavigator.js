import React from "react"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { useTheme } from "../contexts/ThemeContext"
import Ionicons from "@expo/vector-icons/Ionicons"
import HomeScreen from "../screens/HomeScreen"
import ActivityScreen from "../screens/ActivityScreen"
import ProfileScreen from "../screens/ProfileScreen"
import EditProfileScreen from "../screens/EditProfileScreen"
import SettingsScreen from "../screens/SettingsScreen"


const Stack = createNativeStackNavigator()
const Tab = createBottomTabNavigator()

function MainTabs() {
    const { theme } = useTheme()
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                headerShown: true,
                tabBarHideOnKeyboard:true,
                tabBarActiveTintColor: theme.colors.primary,
                tabBarInactiveTintColor: theme.colors.subText,
                tabBarStyle: {
                    backgroundColor: theme.colors.card,
                    borderTopColor: theme.colors.border,
                },
                headerStyle: {
                    backgroundColor: theme.colors.card,
                },
                headerTintColor: theme.colors.text,
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName;

                    if (route.name === 'Home') {
                        iconName = focused ? 'home' : 'home-outline';
                    } else if (route.name === 'Activity') {
                        iconName = focused ? 'accessibility' : 'accessibility-outline';
                    } else if (route.name === 'Profile') {
                        iconName = focused ? 'person' : 'person-outline';
                    }
                    
                    return <Ionicons name={iconName} size={size || 24} color={color} />;
                },
            })}
        >
            <Tab.Screen name="Home" component={HomeScreen} options={{ title:"Home" }} />
            <Tab.Screen name="Activity" component={ActivityScreen}  options={{ title:"Activity" }} />
            <Tab.Screen name="Profile" component={ProfileScreen}  options={{ title:"Profile" }} />
        </Tab.Navigator>
    )
}

export default function AppNavigator() {
    const { theme } = useTheme();
    return (
        <Stack.Navigator screenOptions={{
            headerShown: true,
            headerStyle: {
                backgroundColor: theme.colors.card,
            },
            headerTintColor: theme.colors.text,
            }}>
                <Stack.Screen name="MainTabs" component={MainTabs} options={{ headerShown: false }}/>
                <Stack.Screen name="EditProfile" component={EditProfileScreen}  options={{ title:"Edit Profile" }} />
                <Stack.Screen name="Settings" component={SettingsScreen}  options={{ title:"Settings" }} />
        </Stack.Navigator>
    )
}