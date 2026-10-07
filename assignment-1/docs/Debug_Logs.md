# Debug Logs

This document contains all real debugging records, error investigations, and bug resolutions tracked in the Master Plan for MMA301 Assignment 1.

---

## Debug #DBG-01

* **Problem:** Component import/export failure with `CardShortCut` in React Native screen navigation and rendering.
* **Cause:** Named export versus default export syntax mismatch in `src/components/CardShortCut.jsx` when imported across screen components.
* **Solution:** Corrected the component export definition in `src/components/CardShortCut.jsx` to match standard export conventions and updated screen import statements accordingly.
* **Verification:** Re-ran affected screens (`HomeScreen.jsx`, `AppNavigator.js`) and verified card rendering without runtime import errors.
* **Related Task/Requirement:** Task P5-01 (Phase 5 – Debugging), AI-10 (Runtime debugging), Requirement R08 (Reusable components), Rubric 5.

---

## Debug #DBG-02

* **Problem:** React Native runtime error / crash when user profile name or profile state object is null, missing, or malformed upon cold start (`profile.name null handling`).
* **Cause:** Unhandled null or undefined values during initial state hydration from `AsyncStorage` or form initialization when stored profile data is corrupt or missing.
* **Solution:** Implemented safe initial default profile state (`initialProfile` with default values) and try-catch fallback handling inside `ProfileContext.js` and `ProfileScreen.jsx`.
* **Verification:** Simulated cold start with empty/corrupted `AsyncStorage` state; verified the application recovers gracefully with safe default profile data (TrangTTT) without crashing.
* **Related Task/Requirement:** Task P5-02 (Phase 5 – Debugging), AI-10 (Runtime debugging), Requirement R07 (AsyncStorage persistence), R10 (Error/fallback state), TC11 (Storage Corrupt/Missing), Rubric 5.

---

## Debug #DBG-03

* **Problem:** Metro bundler module resolution failure caused by Windows case-only filename renames.
* **Cause:** Windows case-insensitive file system did not update case-only filename modifications (e.g. `cardItem.jsx` vs `CardItem.jsx`) in Git and Metro bundler cache.
* **Solution:** Executed explicit Git case-sensitive file renames and aligned all component import paths with exact file casing.
* **Verification:** Cleared bundler cache, restarted Metro server, and confirmed all component module imports resolve successfully.
* **Related Task/Requirement:** Task P5-01 / P5-02, AI-10 (Runtime debugging / troubleshooting), Rubric 5.

---

## Debug #DBG-04

* **Problem:** Profile Screen does not update automatically after user saves valid profile modifications in Edit Profile Screen (`Profile not updating after save`).
* **Cause:** Direct local state mutation or missing shared Context state provider propagation across component hierarchy.
* **Solution:** Integrated centralized state management in `ProfileContext.js` with immutable state setters and shared Provider wrapper so all consumer screens re-render upon save.
* **Verification:** Saved edit form in `EditProfileScreen.jsx`, submitted form, and verified `ProfileScreen.jsx` updated immediately upon returning.
* **Related Task/Requirement:** Task P3-13 (Phase 3 – Build), Interview Preparation Q14 & Q17, Requirement R02 (Profile read), R03 (Controlled form), TC04 (Edit Valid).
