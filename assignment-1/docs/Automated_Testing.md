# Automated testing

Run from `assignment-1`:

```sh
npm run test
```

Jest 29 with the Expo SDK 57 `jest-expo` preset and React Native Testing
Library 14 tests the existing application without changing its source behavior.
`test-renderer` is pinned to 1.2.0 for the project's React version.

The four suites cover profile validation (required fields, invalid formats,
length boundaries and trimming), profile storage hydration/update/remount and
failure behavior, theme storage/toggle/remount and failures, and real screen
interactions (invalid/valid submit, cancel, photo permission/selection, theme
selection, profile display and navigation callbacks).

AsyncStorage uses its official in-memory Jest mock. UI tests mock image picker,
icon rendering and toast presentation. These are unit/integration tests; they
do not verify physical storage, device restarts, native permissions, visual
layout or the full navigation stack. The editor test harness waits for profile
hydration before opening the form, as when a user enters it after startup.
Storage write failure tests preserve and document the current optimistic state
behavior; no business logic is changed.

To regenerate evidence and the Excel sheet:

```sh
npm run test -- --json --outputFile=docs/automated-test-results.json
powershell -NoProfile -ExecutionPolicy Bypass -File scripts/update-test-matrix.ps1
```

The script reads actual Jest assertion results into the `Automated Testing`
sheet of `Test_Matrix.xlsx`, preserving the existing manual matrix sheet.
Run time is derived from Jest's timestamp and displayed in UTC+07:00.
`automated-test-results.json` contains the individual results and totals.

Additional checks: test/config ESLint passes. Project lint reports two existing
`react-hooks/set-state-in-effect` errors in HomeScreen/ActivityScreen and three
warnings in application source. `tsc --noEmit` cannot check the project because
this JavaScript project has no tsconfig; no TypeScript migration was introduced.
