🚗 RideLink

Book a ride for someone else — from their shared location.

RideLink is a React Native mobile application designed to simplify booking a ride for another person.

The idea is simple:

Someone shares their location → RideLink receives the pickup location → you enter the destination → RideLink opens Uber with the trip details.

✨ How RideLink Works

📍 Someone shares their location
              ↓
        🔗 RideLink link
              ↓
      📌 Pickup location
              ↓
       🎯 Enter destination
              ↓
       🌍 Resolve destination
              ↓
          🚗 Uber
              ↓
       ✅ Review & confirm

The goal is to remove the need to manually copy and re-enter a person's location when arranging a ride for them.

🚀 Current Features

📍 Pickup location handling

🔎 Address geocoding

🎯 Destination search

🌍 Latitude and longitude support

🧪 Test location for development

🚗 Uber ride-request integration

📱 Android development support

⚡ Expo + React Native

🧩 Modular TypeScript architecture

🔐 Environment-variable based API configuration

🛠️ Tech Stack

Technology

Purpose

React Native

Mobile application

Expo

Development and build platform

Expo Router

Application navigation

TypeScript

Type-safe development

Android Studio

Android emulator and testing

Node.js

Development environment

LocationIQ

Address and coordinate geocoding

Uber Deep Links

Ride handoff

📂 Project Structure

ridelink/
│
├── assets/
│
├── src/
│   ├── app/
│   │   ├── _layout.tsx
│   │   ├── index.tsx
│   │   ├── location.tsx
│   │   └── destination.tsx
│   │
│   ├── components/
│   │   ├── DestinationSearch.tsx
│   │   ├── PickupCard.tsx
│   │   └── PrimaryButton.tsx
│   │
│   ├── services/
│   │   ├── geocoding.ts
│   │   ├── locationParser.ts
│   │   └── uber.ts
│   │
│   ├── types/
│   │   ├── location.ts
│   │   └── open-location-code-ts.d.ts
│   │
│   └── utils/
│       └── constants.ts
│
├── .env
├── .gitignore
├── app.json
├── package.json
├── package-lock.json
├── tsconfig.json
└── README.md

📍 Shared Location

The planned production flow supports a RideLink URL containing pickup coordinates:

https://ridelink.app/pickup?lat=17.385044&lng=78.486671

RideLink can then:

Read the latitude and longitude.

Resolve the coordinates into a readable address.

Display the pickup location.

Ask for the destination.

Resolve the destination coordinates.

Open the Uber ride flow.

The current manual pickup input is a development/testing fallback. The intended final experience is based on receiving the pickup location through a shared RideLink link.

🚗 Uber Integration

RideLink is designed around Uber's official ride-request deep-link mechanism.

RideLink
   │
   ├── Pickup coordinates
   │
   └── Destination coordinates
             │
             ↓
       Uber Deep Link
             │
       ┌─────┴─────┐
       ↓           ↓
   Uber App    Uber Web

Uber remains responsible for the final ride experience, including reviewing the trip and confirming the ride.

🧪 Development Status

Completed

Expo React Native project setup

TypeScript configuration

Pickup location screen

Manual pickup testing

Test pickup location

Pickup coordinates

Address geocoding

Destination screen

Destination geocoding

Pickup → destination flow

Android emulator setup

TypeScript validation

In Progress

Shared-location link handling

Automatic pickup extraction from shared coordinates

Production-ready Uber deep-link flow

Compatible Android emulator testing

Real-device testing

Final UI/UX improvements

Production release preparation

🗺️ Roadmap

Phase 1 — Foundation

React Native setup

Location handling

Geocoding

Destination handling

Phase 2 — Smart Location Sharing

RideLink shared-location URLs

Coordinate extraction

Automatic pickup detection

Pickup validation

Phase 3 — Ride Integration

Uber deep-link integration

Native Uber testing

Uber web fallback

Complete ride handoff testing

Phase 4 — Production

UI/UX refinement

Robust error handling

Android real-device testing

Performance testing

Production release

🔑 Environment Variables

API keys and secrets must never be hardcoded into source code.

Create a local .env file:

EXPO_PUBLIC_LOCATIONIQ_API_KEY=your_api_key_here

Never commit the real .env file to GitHub.

Make sure .env is included in .gitignore.

💻 Run RideLink Locally

Clone the repository:

git clone <your-repository-url>

Enter the project:

cd ridelink

Install dependencies:

npm install

Start Expo:

npx expo start

Start directly on Android:

npx expo start --android

🧪 TypeScript Validation

Before committing changes, run:

npx tsc --noEmit

The command should complete without TypeScript errors.

🤝 Contributing

Contributions are welcome.

Basic workflow

Fork the repository.

Create a feature branch.

git checkout -b feature/your-feature

Make your changes.

Test the application.

Run the TypeScript check.

npx tsc --noEmit

Commit your changes.

git add .
git commit -m "Add your feature"

Push your branch.

git push origin feature/your-feature

Open a Pull Request.

📌 Development Principles

Keep API keys and secrets out of source code.

Never commit .env.

Use TypeScript for application code.

Test changes before committing.

Keep components focused and reusable.

Prefer official APIs and documented integrations.

Keep the user in control of the final ride confirmation.

Avoid storing unnecessary location information.

⚠️ Project Status

RideLink is currently under active development.

Some features are still being tested and may change before the first production release.

📄 License

License information will be added as the project progresses.

🌟 Project Vision

RideLink aims to make arranging rides for other people as simple as sharing a location.

Share the location.
Choose the destination.
Ride.