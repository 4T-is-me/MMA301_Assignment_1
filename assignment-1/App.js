import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import AppNavigator from './src/navigator/AppNavigator';
import { ThemeProvider } from './src/contexts/themeContext';
export default function App() {
  return (
    <ThemeProvider>
      <NavigationContainer>
        <AppNavigator />
        <StatusBar style="auto" />
      </NavigationContainer>
    </ThemeProvider>
  );
}