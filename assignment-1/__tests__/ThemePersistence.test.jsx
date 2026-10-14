import React, { useEffect } from 'react';
import { act, render, waitFor } from '@testing-library/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ThemeProvider, useTheme } from '../src/contexts/ThemeContext';
import { COLORS } from '../src/utils/theme';

let context;
function Consumer() {
  const value = useTheme();
  useEffect(() => { context = value; }, [value]);
  return null;
}
async function mount() {
  context = undefined;
  const view = await render(<ThemeProvider><Consumer /></ThemeProvider>);
  await waitFor(() => expect(context).toBeDefined());
  return view;
}

describe('Theme Persistence (mocked AsyncStorage)', () => {
  test('defaults to light when no preference exists', async () => {
    await mount();
    expect(context.themeMode).toBe('light');
    expect(context.theme.colors.background).toBe(COLORS.light.background);
    expect(AsyncStorage.getItem).toHaveBeenCalledWith('@app_theme');
  });

  test.each(['light', 'dark'])('restores saved %s preference', async (mode) => {
    await AsyncStorage.setItem('@app_theme', mode);
    await mount();
    expect(context.themeMode).toBe(mode);
    expect(context.theme.colors.text).toBe(COLORS[mode].text);
  });

  test('persists both toggle directions and restores after remount', async () => {
    const view = await mount();
    await act(async () => { await context.toggleTheme(); });
    expect(context.themeMode).toBe('dark');
    expect(await AsyncStorage.getItem('@app_theme')).toBe('dark');
    await view.unmount();
    await mount();
    expect(context.themeMode).toBe('dark');
    await act(async () => { await context.toggleTheme(); });
    expect(context.themeMode).toBe('light');
    expect(await AsyncStorage.getItem('@app_theme')).toBe('light');
  });

  test('falls back to light when storage read fails', async () => {
    const error = jest.spyOn(console, 'error').mockImplementation(() => {});
    jest.spyOn(AsyncStorage, 'getItem').mockRejectedValueOnce(new Error('read failed'));
    await mount();
    expect(context.themeMode).toBe('light');
    expect(error).toHaveBeenCalledWith('Error when loading theme from AsyncStorage:', expect.any(Error));
  });

  test('logs a failed write and retains the existing in-memory theme behavior', async () => {
    const error = jest.spyOn(console, 'error').mockImplementation(() => {});
    await mount();
    jest.spyOn(AsyncStorage, 'setItem').mockRejectedValueOnce(new Error('write failed'));
    await act(async () => { await context.toggleTheme(); });
    expect(context.themeMode).toBe('dark');
    expect(await AsyncStorage.getItem('@app_theme')).toBeNull();
    expect(error).toHaveBeenCalledWith('Error when saving theme to AsyncStorage:', expect.any(Error));
  });
});
