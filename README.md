# 🚗 RideLink

### Book a ride for someone else — directly from their shared location.

RideLink is a mobile app designed to make booking an Uber ride for another person much easier.

Imagine a friend, family member, or someone who needs a ride sends you their **current location on WhatsApp**.

Instead of manually copying coordinates, searching for the location, and entering everything again, RideLink is designed to simplify the process:

**Shared Location → RideLink Pickup → Destination → Uber**

---

## 📱 Download RideLink

### Android APK

**[⬇️ Download RideLink APK](https://expo.dev/artifacts/eas/3lFNC6aCiJJLq8BRaG173kRGKUr7FXSvuuMdWDrTHXI.apk)**

The APK is an Android preview build created with Expo EAS.

### Installation

1. Open the APK link on an Android device.
2. Download the APK.
3. If Android asks for permission to install from the browser, allow it.
4. Install RideLink.
5. Open the app and test the ride-booking flow.

---

## 💡 The Problem

Booking a ride for someone else can be surprisingly inconvenient.

For example:

> Your friend is somewhere unfamiliar and sends you their current WhatsApp location.

Normally, you may have to:

1. Open the shared location.
2. Find or copy the location.
3. Open a ride-booking app.
4. Enter the pickup location manually.
5. Enter the destination.
6. Continue with the ride booking.

That's a lot of unnecessary steps.

---

## ⚡ The RideLink Idea

RideLink focuses on making that process simpler.

### Traditional Flow

```text
Friend
  ↓
WhatsApp Location
  ↓
Open Maps
  ↓
Find / Copy Location
  ↓
Open Uber
  ↓
Enter Pickup
  ↓
Enter Destination
  ↓
Book Ride
```

### RideLink Flow

```text
Friend
  ↓
WhatsApp Location
  ↓
RideLink
  ↓
Pickup Location
  ↓
Enter Destination
  ↓
Uber
```

The goal is simple:

> **Turn a shared location into a ride-booking starting point with as little manual work as possible.**

---

## ✨ Key Features

### 📍 Location-Based Pickup

RideLink is designed around the location shared by the person who needs the ride.

### 🎯 Simple Destination Entry

The destination can be entered manually after the pickup location is available.

### 🚗 Uber Handoff

After the pickup and destination are prepared, RideLink can hand the ride information off toward Uber.

### 📱 Mobile-First Experience

RideLink is built as a mobile application using React Native and Expo.

### ⚡ Designed for Speed

The idea is to remove unnecessary steps when arranging a ride for another person.

---

## 🧑‍💻 Example Use Case

Suppose your friend is waiting at a location and sends you their current location through WhatsApp.

Instead of asking:

> "What is the exact address?"

You can use the shared location as the starting point and arrange the ride from there.

This can be useful when:

- A friend needs a ride
- A family member needs transportation
- Someone is unfamiliar with their exact address
- You are booking a ride remotely for another person
- You want to avoid manually re-entering location information

---

## 🛠️ Tech Stack

- **React Native**
- **Expo**
- **Expo Router**
- **TypeScript**
- **LocationIQ**
- **Uber deep linking**
- **Android / Expo EAS**

---

## 🏗️ Project Structure

```text
RideLink/
│
├── assets/
│   └── splash.png
│
├── src/
│   ├── app/
│   │   ├── location.tsx
│   │   └── destination.tsx
│   │
│   ├── components/
│   │   ├── PickupCard.tsx
│   │   ├── DestinationSearch.tsx
│   │   └── PrimaryButton.tsx
│   │
│   ├── services/
│   │   ├── locationParser.ts
│   │   ├── geocoding.ts
│   │   └── uber.ts
│   │
│   ├── types/
│   │   ├── location.ts
│   │   └── open-location-code-ts.d.ts
│   │
│   └── utils/
│       └── constants.ts
│
├── app.json
├── package.json
└── README.md
```

---

## 🚀 Running the Project Locally

Clone the repository:

```bash
git clone https://github.com/pandraladharmakovid-cyber/book-ride-for-others.git
```

Enter the project:

```bash
cd book-ride-for-others
```

Install dependencies:

```bash
npm install
```

Start Expo:

```bash
npx expo start
```

---

## 🔐 Environment Variables

RideLink uses environment variables for API configuration.

Create a `.env` file:

```env
EXPO_PUBLIC_LOCATIONIQ_API_KEY=your_locationiq_api_key
```

Do not commit `.env` or expose API keys publicly.

---

## 🎯 Why RideLink?

RideLink is built around a simple idea:

**The person who needs the ride already has a location.**

Instead of making the person booking the ride manually reproduce that location, RideLink attempts to make the shared location the starting point of the booking process.

That makes the experience:

- **Simpler**
- **Faster**
- **More convenient**
- **Less repetitive**

---

## 📲 Current Platform

| Platform | Status |
|---|---|
| Android | ✅ APK available |
| iOS | Not currently released |
| Web | Not the target platform |

---

## 📦 Android Build

Current Android build:

```text
Version: 1.0.0
Version Code: 1
Build Status: Finished
Distribution: Internal / Preview
```

**[⬇️ Download the latest Android APK](https://expo.dev/artifacts/eas/3lFNC6aCiJJLq8BRaG173kRGKUr7FXSvuuMdWDrTHXI.apk)**

---

## 👨‍💻 Developer

**Pandrala Dharma Kovidh**

BTech Student | AI & Software Developer

### Connect

- GitHub: https://github.com/pandraladharmakovid-cyber
- LinkedIn: https://www.linkedin.com/in/pandrala-dharma-kovidh-0b1b36357/
- Instagram: https://www.instagram.com/pandraladharmakovidh/

---

## ⭐ Support the Project

If you find the idea useful, consider giving the repository a ⭐ on GitHub.

---

## 📄 License

This project is provided for educational and development purposes.