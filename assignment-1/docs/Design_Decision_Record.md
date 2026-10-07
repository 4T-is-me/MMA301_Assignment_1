# Design Decision Record (DDD)

This document records the architectural and technical design decisions made for MMA301 Assignment 1 as tracked in the Master Plan.

---

## Decision #D01

* **Decision:** Centralized Navigation Architecture
* **Context / Problem:** Need ≥5 screens/areas with reliable screen transitions and predictable route navigation.
* **Options Considered:** Separate navigation configuration per screen.
* **Chosen Option:** Central navigation configuration using React Navigation Stack and Tab Navigators in `src/navigation/AppNavigator.js`.
* **Reason:** Centralized navigation responsibility ensures consistent routing, easy screen maintenance, and clear navigation flow.
* **Trade-offs:** Adds route configuration complexity at setup; adding new screens requires updating central navigator file.
* **Related Requirement/Task:** Screen: All | Code: `src/navigation/AppNavigator.js` | Requirement: R01 (App Structure / 5 Screens) | Task: P2-01, P3-02.

---

## Decision #D02

* **Decision:** Scoped State Ownership Model (Local UI vs Shared Context)
* **Context / Problem:** Determining appropriate state scope to prevent unnecessary re-renders while ensuring shared data availability.
* **Options Considered:** Direct prop drilling across all screen components or single monolithic global state.
* **Chosen Option:** Keep localized transient UI state (e.g. form inputs, search filters) local to components; expose shared application state (profile data, theme settings) via React Context (`ProfileContext`, `ThemeContext`).
* **Reason:** Matches actual data scope; prevents deep prop drilling while keeping local interactions performant.
* **Trade-offs:** Updating Context state triggers re-renders across subscribing consumer components.
* **Related Requirement/Task:** Screen: Profile / Edit Profile / Settings | Code: `src/contexts/ProfileContext.js`, `src/contexts/ThemeContext.js` | Requirement: R02, R03, R05 | Task: P2-06, P3-06, P3-08.

---

## Decision #D03

* **Decision:** Context-Integrated AsyncStorage Persistence & Hydration
* **Context / Problem:** App state must survive restart while gracefully tolerating missing or corrupted local storage data.
* **Options Considered:** Direct `AsyncStorage` read/write calls scattered across individual screen components.
* **Chosen Option:** Encapsulate `AsyncStorage` read/write operations inside `ProfileContext.js` and `ThemeContext.js` with startup hydration and safe default fallback handling.
* **Reason:** Centralized handling simplifies storage management, encapsulates try-catch error boundaries, and avoids code duplication across screens.
* **Trade-offs:** Increases Context initial hydration complexity on cold start.
* **Related Requirement/Task:** Screen: App / Profile / Settings | Code: `src/contexts/ProfileContext.js`, `src/contexts/ThemeContext.js` | Requirement: R07 (AsyncStorage persistence), R10 (Error/fallback state) | Task: P2-07, P3-18, P3-19, P3-21.

---

## Decision #D04

* **Decision:** FlatList with Stable keyExtractor & Reusable Item Components
* **Context / Problem:** Displaying activity item collections with support for empty list state, search filtering, and smooth list rendering.
* **Options Considered:** Rendering lists via simple array `.map()` calls within ScrollView.
* **Chosen Option:** Use `FlatList` component with explicit `keyExtractor`, custom `ListEmptyComponent`, and reusable `CardItem` renderer.
* **Reason:** Directly satisfies requirement constraints, provides list virtualization, and handles empty state gracefully.
* **Trade-offs:** Requires more initial setup than simple `.map()` rendering; complex nested lists would require `SectionList`.
* **Related Requirement/Task:** Screen: ActivityScreen | Code: `src/screens/ActivityScreen.jsx`, `src/components/CardItem.jsx` | Requirement: R06 (List & API Integration) | Task: P2-08, P3-15, P3-16.

---

## Decision #D05

* **Decision:** Reusable Component Library Design
* **Context / Problem:** Preventing UI drift and code duplication across multiple screens (Home, Activity, Profile).
* **Options Considered:** Duplicate UI layout code inside individual screen files.
* **Chosen Option:** Create shared component primitives with explicit prop contracts (`src/components/CardItem.jsx`, `src/components/CardShortCut.jsx`).
* **Reason:** Ensures visual consistency, improves code maintainability, and provides clear evidence of component reuse.
* **Trade-offs:** Designing flexible generic prop interfaces requires upfront layout planning.
* **Related Requirement/Task:** Screen: Multiple Screens | Code: `src/components/CardItem.jsx`, `src/components/CardShortCut.jsx` | Requirement: R08 (Reusable components) | Task: P2-09, P3-05, P3-24.

---

## Decision #D06

* **Decision:** Pre-Save Form Validation with Formik & Yup
* **Context / Problem:** Invalid or incomplete user input must be blocked from persisting into AsyncStorage or shared context.
* **Options Considered:** Post-save validation or simple un-validated text input handling.
* **Chosen Option:** Implement client-side pre-save validation schema using Yup (`ProfileSchema.js`) integrated into Formik controlled inputs in `EditProfileScreen.jsx`.
* **Reason:** Protects persisted storage state from corruption and provides real-time visual feedback to users.
* **Trade-offs:** Adds form handling boilerplate and schema setup code.
* **Related Requirement/Task:** Screen: Edit Profile | Code: `src/screens/EditProfileScreen.jsx`, `src/storage/ProfileSchema.js` | Requirement: R04 (Form Validation) | Task: P2-10, P3-11.
