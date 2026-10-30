# MMA301 Assignment 1 - Profile & Activity App

A mobile application built with **React Native (Expo)** for **Assignment 1 - MMA301 (Multiplatform Mobile App Development)**. The application provides a complete flow for managing personal information (**Profile**), editing profile details (**Edit Profile**), viewing activities (**Activity & Interests**), and customizing the application theme (**Light/Dark Mode**).

---

## 📱 Project Overview

- **Project Name:** Profile & Activity App (`assignment-1`)
- **Course:** MMA301 - Multiplatform Mobile App Development
- **Objective:** Demonstrate React Native UI development, multi-screen navigation using Stack & Tab Navigation, centralized state management with Context API, persistent data storage with `AsyncStorage`, form validation using Formik + Yup, and API-based list rendering with `FlatList`.

---

## ✨ Features / Implemented Screens

### 1. **HomeScreen (`HomeScreen.jsx`)**

- Personalized welcome banner with dynamically formatted date.
- Shortcut cards for quick access to Profile, Activity, and Settings.
- **Recent Activities** section that loads the 3 latest posts from the API and supports instant Like interactions.

### 2. **ProfileScreen (`ProfileScreen.jsx`)**

- Displays the user's Avatar, Full Name, Email, Phone Number, Location, and personal Bio from `ProfileContext`.
- **Edit Profile** button navigates to the Edit Profile screen.
- Settings button in the Header Bar and a shortcut below the profile card.

### 3. **EditProfileScreen (`EditProfileScreen.jsx`)**

- Controlled form using **Formik** with data validation through **Yup** (`ProfileSchema`).
- Supports changing the profile picture directly from the device's image library using **`expo-image-picker`**.
- Real-time validation for Full Name, Email, Phone Number, Location, and Bio.
- Displays successful or failed save feedback using **Toast Notification** (`react-native-toast-message`).
- Provides a smoother keyboard experience using `KeyboardAvoidingView`.

### 4. **ActivityScreen (`ActivityScreen.jsx`)**

- Integrates a real API using **Axios** with the endpoint `https://dummyjson.com/posts`.
- **Search Bar** for filtering posts by keywords.
- **Tag Filter** displaying categories in a horizontal list.
- **Post List (`FlatList`)**:
  - **Pull-to-refresh (`RefreshControl`)**: Pull down to refresh the post list.
  - **Infinite Scroll (`onEndReached`)**: Automatically loads more posts through pagination.
  - **Empty State (`ListEmptyComponent`)**: Displays a message when no results are found.
  - **Like Interaction**: Dynamically updates the number of likes.

### 5. **SettingsScreen (`SettingsScreen.jsx`)**

- Supports **Light Mode** and **Dark Mode** with visual theme preview cards.
- Displays application version information (`Your Space - v1.0`).

---

## 🛠 Tech Stack & Core Packages

- **Framework:** React Native (Expo SDK ~58)
- **Language:** JavaScript (ES6+)
- **Navigation:** React Navigation v7 (`@react-navigation/native`, `@react-navigation/native-stack`, `@react-navigation/bottom-tabs`)
- **State Management:** React Context API (`ThemeContext`, `ProfileContext`)
- **Data Persistence:** `@react-native-async-storage/async-storage` (v2.2.0)
- **Form & Validation:** `formik` + `yup`
- **HTTP Client:** `axios`
- **Icons & Media:** `@expo/vector-icons` (Ionicons), `expo-image-picker`
- **UI Feedback:** `react-native-toast-message`, `react-native-safe-area-context`

---

## 📁 Project Structure

```text
assignment-1/

├── App.js                       # Root Component (Theme & Profile Providers + Navigation)
├── app.json                     # Expo Project configuration
├── package.json                 # Dependencies & scripts

├── src/
│   ├── components/              # Reusable UI Components
│   │   ├── CardItem.jsx         # Activity post card (title, body, tags, likes, views)
│   │   └── CardShortCut.jsx     # Navigation shortcut card
│
│   ├── contexts/                # Shared Context State
│   │   ├── ProfileContext.js    # Manages & persists user profile
│   │   └── ThemeContext.js      # Manages & persists Light/Dark theme
│
│   ├── navigator/
│   │   └── AppNavigator.js      # Stack & Bottom Tab Navigation configuration
│
│   ├── screens/                 # Main application screens
│   │   ├── HomeScreen.jsx
│   │   ├── ProfileScreen.jsx
│   │   ├── EditProfileScreen.jsx
│   │   ├── ActivityScreen.jsx
│   │   └── SettingsScreen.jsx
│
│   ├── services/
│   │   └── activityService.js   # API integration for posts (DummyJSON)
│
│   ├── storage/
│   │   └── ProfileSchema.js     # Yup validation schema for Profile
│
│   ├── styles/                  # Independent StyleSheet for each screen
│   │   ├── ActivityStyles.jsx
│   │   ├── EditProfileStyles.jsx
│   │   ├── HomeStyles.jsx
│   │   ├── ProfileStyles.jsx
│   │   └── SettingsStyles.jsx
│
│   └── utils/
│       └── theme.js             # System color definitions (COLORS light/dark)
```

---

## 🧭 Navigation Flow

The navigation system combines **Native Stack Navigator** and **Bottom Tab Navigator**:

```text
AppNavigator (Stack Navigator)

├── MainTabs (Bottom Tab Navigator)
│   ├── Home (HomeScreen)
│   ├── Activity (ActivityScreen)
│   └── Profile (ProfileScreen)
│
├── EditProfile (EditProfileScreen - Push Screen)
└── Settings (SettingsScreen - Push Screen)
```

- **Bottom Tabs:** Provides quick navigation between the three main areas: `Home`, `Activity`, and `Profile`.
- **Stack Navigation:** When the user taps **Edit Profile** from `ProfileScreen` or **Settings** from `HomeScreen` / `ProfileScreen`, the corresponding screen is pushed onto the Stack and can be closed using `goBack()`.

---

## 🔄 State Management & Persistence Strategy

| State | Managed By | Persistence | Fallback |
| :--- | :--- | :--- | :--- |
| **User Profile** (name, email, bio, avatar) | `ProfileContext` | `AsyncStorage` (`@user_profile`) | `DEFAULT_PROFILE` is used when storage is empty or fails |
| **App Theme** (light / dark) | `ThemeContext` | `AsyncStorage` (`@app_theme`) | Default `light` mode |
| **Form Data & Validation** | Local Formik (`EditProfileScreen`) | None (saved only when Save is pressed) | Reset using the current profile data |
| **Search / Filter / Pagination** | Local State (`ActivityScreen`) | None | Reset when reloading/refreshing |
| **Post Likes** | Local State (`HomeScreen` & `ActivityScreen`) | Component local state | Default `likes` value from the API |

---

## 🧩 Reusable Components

### 1. **`CardItem` (`src/components/CardItem.jsx`)**

- Reusable card for displaying post information in both HomeScreen and ActivityScreen.
- Receives the following props: `item`, `isLiked`, `likesCount`, `toggleLike`.
- Automatically changes background, border, and text colors according to the active ThemeContext.

### 2. **`CardShortCut` (`src/components/CardShortCut.jsx`)**

- Reusable shortcut card with an Icon, Title, Description, and navigation Chevron.
- Receives the following props: `title`, `description`, `iconName`, `onPress`.

---

## 🚀 Installation & Running

### Requirements

- Node.js (v18 or higher)
- Expo Go app on Android / iOS, or an Android Emulator / iOS Simulator.

### Steps

1. **Navigate to the project directory:**

```bash
cd assignment-1
```

2. **Install dependencies:**

```bash
npm install
```

3. **Start the development server:**

```bash
npm run start

# or
npx expo start
```

4. **Run the application:**

- Scan the QR code using the **Expo Go** app on your mobile device.
- Or press `a` to open the Android Emulator / `i` to open the iOS Simulator.

---

## 📊 Assignment Requirements Checklist (RTM Matrix)

| ID | Assignment Requirement | Actual Status | Code Evidence |
| :--- | :--- | :--- | :--- |
| **R01** | Expo/React Native project follows the required structure | **Completed** | `package.json`, `app.json`, `App.js` |
| **R02** | Navigation between ≥ 5 areas/screens | **Completed** | 5 screens: Home, Profile, EditProfile, Activity, Settings |
| **R03** | Display Profile data | **Completed** | `ProfileScreen.jsx`, `ProfileContext.js` |
| **R04** | Edit Profile + validation | **Completed** | `EditProfileScreen.jsx`, `ProfileSchema.js` (Formik + Yup) |
| **R05** | Shared Light/Dark Theme using Context | **Completed** | `ThemeContext.js`, `theme.js`, `SettingsScreen.jsx` |
| **R06** | Render data using FlatList | **Completed** | `ActivityScreen.jsx` & `HomeScreen.jsx` |
| **R07** | Persistence using AsyncStorage | **Completed** | Save/load profile (`@user_profile`) & theme (`@app_theme`) |
| **R08** | Reusable components | **Completed** | `CardItem.jsx`, `CardShortCut.jsx` |
| **R09** | Responsive Flexbox/style | **Completed** | `ActivityStyles.jsx`, `ProfileStyles.jsx`, `HomeStyles.jsx` |
| **R10** | Error / Fallback states | **Completed** | Storage fallback, empty list state, form error messages |

---

## ⚠️ Notes & Limitations

- **Activity List uses FlatList:** The project uses `FlatList` for `ActivityScreen`, combined with a horizontal Tag Filter FlatList and real-time search. `SectionList` grouping has not been implemented.
- **Like Status Persistence:** Like states are currently stored in the screen's internal `useState`. They are not persisted to `AsyncStorage` or synchronized with a backend API through POST requests.
- **Local Avatar Image:** When the user selects a new profile picture through `expo-image-picker`, the local URI (`file://...`) is recorded and stored in the device's AsyncStorage.
