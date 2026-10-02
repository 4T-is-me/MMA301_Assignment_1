import React, { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { COLORS } from "../utils/theme";

const themeContext = createContext();
const THEME_KEY = '@app_theme';

export const ThemeProvider = ({ children }) => {
    const [themeMode, setThemeMode] = useState('light');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadTheme = async () => {
            try {
                const savedTheme = await AsyncStorage.getItem(THEME_KEY);
                if (savedTheme !== null) {
                    setThemeMode(savedTheme);
                }
            } catch (error) {
                console.error('Error when loading theme from AsyncStorage:', error);
            } finally {
                setLoading(false);
            }
        }
        loadTheme();
    }, [])

    const toggleTheme = async () => {
        try {
            const nextMode = themeMode === "light" ? "dark" : "light";
            setThemeMode(nextMode);
            await AsyncStorage.setItem(THEME_KEY, nextMode);
        } catch (error) {
            console.error('Error when saving theme to AsyncStorage:', error);
        }
    }

    const theme = {
        mode: themeMode,
        colors: {
            primary: COLORS.primary,
            primaryLight: COLORS.primaryLight,
            ...COLORS[themeMode],
        }
    }

    if (loading) {
        return null;
    }

    return (
        <themeContext.Provider value={{theme, themeMode, toggleTheme}}>
            {children}
        </themeContext.Provider>
    )
}

export const useTheme = () => useContext(themeContext)