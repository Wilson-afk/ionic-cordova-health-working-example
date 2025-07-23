# Ionic Cordova Health Working Example

This is a working example of an Ionic + Cordova app that reads health data from Google Fit / Health Connect using `cordova-plugin-health`.

## Features

- Steps tracking (raw + aggregated)
- Distance tracking
- Heart Rate (aggregated)
- Calories burned
- Android Health Permissions handled
- Built with Ionic 7 + Capacitor + Cordova

---

## 🚀 How to Run

Install dependencies and run on Android:

```bash
npm install
ionic build
npx cap sync android
sed -i 's/JavaVersion.VERSION_21/JavaVersion.VERSION_17/g' android/capacitor-cordova-android-plugins/build.gradle
cd android/
./gradlew assembleRelease
