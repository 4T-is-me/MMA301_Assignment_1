import React, { useEffect } from 'react';
import { act, render, waitFor } from '@testing-library/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ProfileProvider, useProfile } from '../src/contexts/ProfileContext';

let context;
function Consumer() {
  const value = useProfile();
  useEffect(() => { context = value; }, [value]);
  return null;
}
async function mount() {
  const view = await render(<ProfileProvider><Consumer /></ProfileProvider>);
  await waitFor(() => expect(context.loading).toBe(false));
  return view;
}

describe('Profile Persistence (mocked AsyncStorage)', () => {
  test('loads defaults when storage is empty', async () => {
    await mount();
    expect(AsyncStorage.getItem).toHaveBeenCalledWith('@user_profile');
    expect(context.profile).toEqual(expect.objectContaining({ name: 'TrangTTT', phone: '0912345678' }));
  });

  test('merges a saved partial profile with defaults', async () => {
    await AsyncStorage.setItem('@user_profile', JSON.stringify({ name: 'Saved User' }));
    await mount();
    expect(context.profile.name).toBe('Saved User');
    expect(context.profile.email).toBe('thaotrangtothi@gmail.com');
  });

  test('saves all fields, updates shared state, and restores after remount', async () => {
    const view = await mount();
    const updated = { ...context.profile, name: 'Updated User', phone: '0987654321', avatar: 'file:///new.jpg' };
    await act(async () => expect(await context.updateProfile(updated)).toBe(true));
    expect(context.profile).toEqual(updated);
    expect(AsyncStorage.setItem).toHaveBeenCalledWith('@user_profile', JSON.stringify(updated));
    await view.unmount();
    await mount();
    expect(context.profile).toEqual(updated);
  });

  test.each(['{broken', 'null', '42'])('falls back for unusable saved JSON: %s', async (saved) => {
    const error = jest.spyOn(console, 'error').mockImplementation(() => {});
    await AsyncStorage.setItem('@user_profile', saved);
    await mount();
    expect(context.profile.name).toBe('TrangTTT');
    if (saved === '{broken') expect(error).toHaveBeenCalled();
  });

  test('finishes loading with defaults when storage read fails', async () => {
    const error = jest.spyOn(console, 'error').mockImplementation(() => {});
    jest.spyOn(AsyncStorage, 'getItem').mockRejectedValueOnce(new Error('read failed'));
    await mount();
    expect(context.profile.name).toBe('TrangTTT');
    expect(error).toHaveBeenCalledWith('error loading profile', expect.any(Error));
  });

  test('reports a failed write while retaining the existing optimistic state behavior', async () => {
    const error = jest.spyOn(console, 'error').mockImplementation(() => {});
    await mount();
    const updated = { ...context.profile, name: 'Unsaved User' };
    jest.spyOn(AsyncStorage, 'setItem').mockRejectedValueOnce(new Error('write failed'));
    await act(async () => { await expect(context.updateProfile(updated)).rejects.toBe(false); });
    expect(context.profile.name).toBe('Unsaved User');
    expect(await AsyncStorage.getItem('@user_profile')).toBeNull();
    expect(error).toHaveBeenCalledWith('error updating profile', expect.any(Error));
  });
});
