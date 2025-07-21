# InventTrack Mobile

## Introduction
This is the InventTrack Mobile app, built with Expo, React Native, and TypeScript. It provides inventory management features, analytics, and a modern UI for business operations.

## Installations

Clone the repository and install dependencies:

```sh
git clone <your-repo-url>
cd project
npm install
```

Or, if you use yarn:

```sh
yarn install
```

## Running Locally

To start the Expo development server:

```sh
npm run dev
```

Or with yarn:

```sh
yarn dev
```

This will launch the Expo app. You can scan the QR code with the Expo Go app on your device or run on an emulator.

## Building Locally

To build the app for Android locally (APK):

```sh
eas build -p android --profile preview
```

To build for iOS (requires Mac and Apple Developer account):

```sh
eas build -p ios --profile preview
```

For more build options, see the [Expo EAS Build documentation](https://docs.expo.dev/build/introduction/).
