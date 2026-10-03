import React, { useState, useEffect, createContext, useContext } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const ProfileContext = createContext();
const PROFILE_KEY = "@user_profile";
const DEFAULT_PROFILE = {
    name: 'TrangTTT',
    email: 'thaotrangtothi@gmail.com',
    bio: 'Mobile App Developer | React Native & Expo Enthusiast',
    avatar: 'https://picsum.photos/200',
};
export const ProfileProvider = ({ children }) => {
    const [profile, setProfile] = useState(DEFAULT_PROFILE);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadProfile = async () => {
            try {
                const savedData = await AsyncStorage.getItem(PROFILE_KEY);
                if (savedData) {
                    const parsedProfile = JSON.parse(savedData);
                    setProfile({
                        ...DEFAULT_PROFILE,
                        ...(parsedProfile && typeof parsedProfile === 'object' ? parsedProfile : {}),
                    });
                }
            } catch (error) {
                console.error("error loading profile", error);
            }finally {
                setLoading(false);
            }
        }
        loadProfile();
    }, [])


    const updateProfile = async (newProfileData) => {
        try {
            setProfile(newProfileData);
            await AsyncStorage.setItem(PROFILE_KEY, JSON.stringify(newProfileData));
            return true;
        } catch (error) {
            console.error("error updating profile", error);
            throw false;
        }
    }

    return (
        <ProfileContext.Provider value={{ profile, loading, updateProfile }}>
            {children}
        </ProfileContext.Provider>
    )
}
export const useProfile = () => useContext(ProfileContext);