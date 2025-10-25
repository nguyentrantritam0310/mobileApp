@echo off
echo Clearing React Native cache...

echo 1. Clearing Metro cache...
npx react-native start --reset-cache

echo 2. Clearing npm cache...
npm cache clean --force

echo 3. Clearing Expo cache...
npx expo start --clear

echo Done! Please restart the app.
pause


