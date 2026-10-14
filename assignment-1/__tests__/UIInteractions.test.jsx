import React from 'react';
import { fireEvent, render, waitFor } from '@testing-library/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';
import * as ImagePicker from 'expo-image-picker';
import { ProfileProvider, useProfile } from '../src/contexts/ProfileContext';
import { ThemeProvider } from '../src/contexts/ThemeContext';
import EditProfileScreen from '../src/screens/EditProfileScreen';
import SettingsScreen from '../src/screens/SettingsScreen';
import ProfileScreen from '../src/screens/ProfileScreen';

// Native media/font rendering and toast presentation are outside this Jest suite.
jest.mock('@expo/vector-icons', () => ({ Ionicons: () => null }));
jest.mock('react-native-toast-message', () => ({ show: jest.fn() }));
jest.mock('expo-image-picker', () => ({
  requestMediaLibraryPermissionsAsync: jest.fn(),
  launchImageLibraryAsync: jest.fn(),
}));

const saved = {
  name: 'Saved User', email: 'saved@example.com', phone: '0912345678',
  location: 'Da Nang', bio: 'Developer', avatar: 'file:///avatar.jpg',
};
let navigation;
function LoadedEditor() {
  const { loading } = useProfile();
  return loading ? null : <EditProfileScreen navigation={navigation} />;
}
async function edit() {
  await AsyncStorage.setItem('@user_profile', JSON.stringify(saved));
  const view = await render(
    <ThemeProvider><ProfileProvider><LoadedEditor /></ProfileProvider></ThemeProvider>
  );
  await waitFor(() => expect(view.getByPlaceholderText('Enter your name').props.value).toBe(saved.name));
  AsyncStorage.setItem.mockClear();
  return view;
}
beforeEach(() => {
  navigation = { goBack: jest.fn(), navigate: jest.fn(), setOptions: jest.fn() };
});

describe('UI interactions', () => {
  test('invalid submit displays validation errors without saving or navigating', async () => {
    const view = await edit();
    await fireEvent.changeText(view.getByPlaceholderText('Enter your name'), '');
    await fireEvent.changeText(view.getByPlaceholderText('Enter your email'), 'bad-email');
    await fireEvent.press(view.getByText('Save Changes'));
    await waitFor(() => {
      expect(view.getByText('Name is required!')).toBeTruthy();
      expect(view.getByText('Email is invalid!')).toBeTruthy();
    });
    expect(AsyncStorage.setItem).not.toHaveBeenCalled();
    expect(navigation.goBack).not.toHaveBeenCalled();
  });

  test('valid submit saves edited fields and shows success before returning', async () => {
    const view = await edit();
    await fireEvent.changeText(view.getByPlaceholderText('Enter your name'), 'Updated User');
    await fireEvent.changeText(view.getByPlaceholderText('Enter your city/country'), 'Ho Chi Minh City');
    await fireEvent.press(view.getByText('Save Changes'));
    await waitFor(() => expect(navigation.goBack).toHaveBeenCalledTimes(1));
    expect(JSON.parse(await AsyncStorage.getItem('@user_profile'))).toEqual({
      ...saved, name: 'Updated User', location: 'Ho Chi Minh City',
    });
    expect(Toast.show).toHaveBeenCalledWith(expect.objectContaining({ type: 'success' }));
  });

  test('cancel discards local edits without writing storage', async () => {
    const view = await edit();
    await fireEvent.changeText(view.getByPlaceholderText('Enter your name'), 'Discarded User');
    await fireEvent.press(view.getByText('Cancel'));
    expect(navigation.goBack).toHaveBeenCalledTimes(1);
    expect(AsyncStorage.setItem).not.toHaveBeenCalled();
    expect(JSON.parse(await AsyncStorage.getItem('@user_profile'))).toEqual(saved);
  });

  test('denied photo permission shows an error and does not open the picker', async () => {
    ImagePicker.requestMediaLibraryPermissionsAsync.mockResolvedValueOnce({ granted: false });
    const view = await edit();
    await fireEvent.press(view.getByText('Change Profile Photo'));
    await waitFor(() => expect(Toast.show).toHaveBeenCalledWith(expect.objectContaining({ type: 'error' })));
    expect(ImagePicker.launchImageLibraryAsync).not.toHaveBeenCalled();
    expect(AsyncStorage.setItem).not.toHaveBeenCalled();
  });

  test('selected photo URI is persisted when the user saves', async () => {
    ImagePicker.requestMediaLibraryPermissionsAsync.mockResolvedValueOnce({ granted: true });
    ImagePicker.launchImageLibraryAsync.mockResolvedValueOnce({ canceled: false, assets: [{ uri: 'file:///picked.jpg' }] });
    const view = await edit();
    await fireEvent.press(view.getByText('Change Profile Photo'));
    await waitFor(() => expect(ImagePicker.launchImageLibraryAsync).toHaveBeenCalled());
    await fireEvent.press(view.getByText('Save Changes'));
    await waitFor(() => expect(navigation.goBack).toHaveBeenCalled());
    expect(JSON.parse(await AsyncStorage.getItem('@user_profile')).avatar).toBe('file:///picked.jpg');
  });

  test('settings selects dark/light and pressing the active theme does not toggle it', async () => {
    const view = await render(<ThemeProvider><SettingsScreen /></ThemeProvider>);
    await waitFor(() => expect(view.getByText('Sáng')).toBeTruthy());
    await fireEvent.press(view.getByText('Tối'));
    await waitFor(() => expect(AsyncStorage.setItem).toHaveBeenCalledWith('@app_theme', 'dark'));
    AsyncStorage.setItem.mockClear();
    await fireEvent.press(view.getByText('Tối'));
    expect(AsyncStorage.setItem).not.toHaveBeenCalled();
    await fireEvent.press(view.getByText('Sáng'));
    await waitFor(() => expect(AsyncStorage.setItem).toHaveBeenCalledWith('@app_theme', 'light'));
    AsyncStorage.setItem.mockClear();
    await fireEvent.press(view.getByText('Sáng'));
    expect(AsyncStorage.setItem).not.toHaveBeenCalled();
  });

  test('profile renders stored data and opens Edit Profile and Settings', async () => {
    await AsyncStorage.setItem('@user_profile', JSON.stringify(saved));
    const view = await render(
      <ThemeProvider><ProfileProvider><ProfileScreen navigation={navigation} /></ProfileProvider></ThemeProvider>
    );
    await waitFor(() => expect(view.getByText(saved.name)).toBeTruthy());
    expect(view.getByText(saved.email)).toBeTruthy();
    expect(view.getByText(saved.phone)).toBeTruthy();
    expect(view.getByText(saved.location)).toBeTruthy();
    await fireEvent.press(view.getByText('Edit Profile'));
    expect(navigation.navigate).toHaveBeenCalledWith('EditProfile');
    await fireEvent.press(view.getByText('Settings'));
    expect(navigation.navigate).toHaveBeenCalledWith('Settings');
  });
});
