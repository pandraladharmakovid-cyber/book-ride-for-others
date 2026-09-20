# 🚕 RideLink

RideLink is an Android-focused app designed to make it easier to book an Uber ride for someone who has shared their location.

## 🚧 Project Status

**Work in Progress**

RideLink is currently under active development. The core workflow is being built and tested step by step.

### Current Progress

- [x] React Native + Expo project setup
- [x] TypeScript configuration
- [x] RideLink UI
- [x] Pickup location workflow
- [x] Destination input
- [x] LocationIQ geocoding integration
- [x] Normal address → coordinates
- [x] Coordinate input support
- [x] Uber deep-link generation
- [ ] Plus Code support
- [ ] Testing Uber deep links on a real Android device
- [ ] WhatsApp location sharing workflow
- [ ] Final UI/UX improvements
- [ ] Production testing
- [ ] Final Android build

## 🎯 Goal

The goal of RideLink is to simplify this process:

**Friend shares location → RideLink receives pickup location → Enter destination → Open Uber with the ride information ready.**

RideLink does not directly book the ride. The final ride review and confirmation are handled by Uber.

## 🛠️ Tech Stack

- React Native
- Expo
- TypeScript
- Expo Router
- LocationIQ
- Uber Deep Links

## 🔐 Privacy

RideLink is designed to use location information only for the ride workflow.

API keys and other private credentials are stored locally in environment variables and are not included in the repository.

## 📁 Project Structure

```text
ridelink/
├── assets/
├── src/
│   ├── app/
│   ├── components/
│   ├── services/
│   ├── types/
│   └── utils/
├── .env
├── .gitignore
├── app.json
├── package.json
├── tsconfig.json
└── README.md