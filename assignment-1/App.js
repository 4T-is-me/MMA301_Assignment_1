// Author: trangtttce191027
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import AppNavigator from './src/navigator/AppNavigator';
import { ThemeProvider } from './src/contexts/ThemeContext';
import { ProfileProvider } from './src/contexts/ProfileContext';
export default function App() {
  return (
    <ThemeProvider>
      <NavigationContainer>
        <ProfileProvider>
        <AppNavigator />
        <StatusBar style="auto" />
        </ProfileProvider>
      </NavigationContainer>
    </ThemeProvider>
  );
}