import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, Platform, KeyboardAvoidingView, TextInput } from "react-native";
import { useTheme } from "../contexts/ThemeContext";
import { styles } from "../styles/EditProfileStyles";
import {Formik} from "formik";
import { ProfileSchema } from "../storage/ProfileSchema";
import { useProfile } from "../contexts/ProfileContext";
import Toast from "react-native-toast-message"
import * as ImagePicker from "expo-image-picker";
import {Ionicons} from "@expo/vector-icons"

export default function EditProfileScreen({ navigation }) {
    const {  theme } = useTheme();
    const {profile, updateProfile} = useProfile();

    const handleImagePicked = async (setFieldValue ) => {
        //permission to access the camera roll
        const permissions = await ImagePicker.requestMediaLibraryPermissionsAsync();

        if(!permissions.granted) {
            Toast.show({
                type: "error",
                text1: "Failed to access the camera roll. Please try again!",
                position: "top",
            })
            return;
        }
        //access the camera roll
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,// allow editing the image
            aspect: [1, 1],
            quality: 1,
        })

        if(!result.canceled && result.assets.length > 0) {
            //save link in formik state
            const selectedImageUri = result.assets[0].uri;
            setFieldValue('avatar', selectedImageUri);
        }
}


    const handleSave = async (values) => {
        const success = await updateProfile(values);
        if(success) {
            Toast.show({
                type: "success",
                text1: "Profile updated successfully!",
                position: "top",
            })
            navigation.goBack();
        }else {
            Toast.show({
                type: "error",
                text1: "Failed to save profile. Please try again!",
                position: "top",
            })
        }
    }

    return (
        <KeyboardAvoidingView style={{flex: 1}} behavior={ Platform.OS === "ios" ? "padding" : "height" }>
            <ScrollView style={[ styles.container, { backgroundColor: theme.colors.background}]} contentContainerStyle={{ padding: 20 }}>
                <Formik
                    initialValues={{
                        name: profile.name || "",
                        email: profile.email || "",
                        bio: profile.bio || "",
                        avatar: profile.avatar || ""
                    }}
                    validationSchema={ProfileSchema}
                    onSubmit={handleSave}
                >
                    {({handleChange, handleBlur, handleSubmit, setFieldValue, touched, values, errors, isSubmitting}) =>(
                        <View>
                            {/* pick image */}
                            <View style={[styles.avatarSection, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
                                <TouchableOpacity onPress={() => handleImagePicked(setFieldValue)} style={[styles.avatarWrapper, { backgroundColor: theme.colors.primary, borderColor: theme.colors.border }]}>
                                    <Image source={{ uri: values.avatar}} style={styles.avatarImage} />
                                    <View style={[styles.cameraBadge, { backgroundColor: theme.colors.primary }]}>
                                        <Ionicons name="camera" size={16} color={"#FFF"} />
                                    </View>
                                </TouchableOpacity>
                            
                                <TouchableOpacity onPress={() => handleImagePicked(setFieldValue)}>
                                    <Text style={[styles.changePhotoText, { color: theme.colors.primary }]}>Change Profile Photo</Text>
                                </TouchableOpacity>
                                {touched.avatar && errors.avatar && (
                                    <Text style={styles.errorText}>{errors.avatar}</Text>
                                )}
                            </View>
                            {/* name */}
                            <View style={styles.inputGroup}>
                                <Text style={[styles.label, { color: theme.colors.text }]}>
                                    Full Name <Text style={styles.required}>*</Text>
                                </Text>

                                <TextInput
                                    style={[styles.input, { backgroundColor: theme.colors.inputBg, color: theme.colors.text, borderColor: touched.name && errors.name ? '#FF3B30' : theme.colors.border}]}
                                    value={values.name}
                                    onChangeText={handleChange("name")}
                                    onBlur={handleBlur("name")}
                                    placeholder="Enter your name"
                                    placeholderTextColor={theme.colors.text}
                                />
                                {touched.name && errors.name && (
                                    <Text style={styles.errorText}>{errors.name}</Text>
                                )}
                            </View>

                            {/* email     */}
                            <View style={styles.inputGroup}>
                                <Text style={[styles.label, { color: theme.colors.text }]}>
                                    Email Address<Text style={styles.required}>*</Text>
                                </Text>

                                <TextInput
                                    style={[styles.input, { backgroundColor: theme.colors.inputBg, color: theme.colors.text, borderColor: touched.email && errors.email ? '#FF3B30' : theme.colors.border}]}
                                    value={values.email}
                                    onChangeText={handleChange("email")}
                                    onBlur={handleBlur("email")}
                                    placeholder="Enter your email"
                                    placeholderTextColor={theme.colors.text}
                                />
                                {touched.email && errors.email && (
                                    <Text style={styles.errorText}>{errors.email}</Text>
                                )}
                            </View>

                            {/* FIELD: Bio */}
                            <View style={styles.inputGroup}>
                                <Text style={[styles.label, { color: theme.colors.text }]}>Bio</Text>

                                <TextInput
                                    style={[styles.input, styles.textArea, { backgroundColor: theme.colors.inputBg, color: theme.colors.text, borderColor: touched.bio && errors.bio ? '#FF3B30' : theme.colors.border}]}
                                    value={values.bio}
                                    onChangeText={handleChange("bio")}
                                    onBlur={handleBlur("bio")}
                                    placeholder="Write a short bio..."
                                    placeholderTextColor={theme.colors.text}
                                    multiline
                                    numberOfLines={4}
                                    textAlignVertical="top"
                                />
                                {touched.bio && errors.bio && (
                                    <Text style={styles.errorText}>{errors.bio}</Text>
                                )}
                            </View>
                        {/* ACTION BUTTONS */}
                            <View style={styles.buttonRow}>
                                <TouchableOpacity
                                    style={[styles.button, styles.cancelBtn, { borderColor: theme.colors.border }]}
                                    onPress={() => navigation.goBack()}
                                    disabled={isSubmitting}
                                >
                                    <Text style={[styles.cancelBtnText, { color: theme.colors.text }]}>Cancel</Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={[styles.button, styles.saveBtn, { backgroundColor: theme.colors.primary }]}
                                    onPress={handleSubmit}
                                    disabled={isSubmitting}
                                >
                                    <Ionicons name="checkmark" size={18} color="#FFF" />
                                    <Text style={styles.saveBtnText}>Save Changes</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    )}
                </Formik>
            </ScrollView>
        </KeyboardAvoidingView>
    )
}