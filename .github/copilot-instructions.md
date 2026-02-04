# HeartMap - Copilot Instructions

## Project Overview
HeartMap is a Valentine's-themed web app where users log in with Google, drop a love status on a global map, attach a YouTube song, and chat in real time with other users.

## Tech Stack
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + shadcn/ui
- **Authentication**: Firebase Auth (Google)
- **Database**: Firestore (real-time)
- **Maps**: Leaflet + OpenStreetMap
- **Music**: YouTube Embed API

## Project Structure
```
/app                    # Next.js App Router pages
/components             # React components
  /ui                   # shadcn/ui components
  /map                  # Map-related components
  /chat                 # Chat components
  /auth                 # Authentication components
/lib                    # Utilities and configurations
  /firebase             # Firebase configuration
/hooks                  # Custom React hooks
/types                  # TypeScript type definitions
```

## Data Models (Firestore)
- **Users**: userId, nickname, createdAt
- **Pins**: userId, nickname, status, youtubeId, lat, lng, createdAt
- **Chats**: chatId, participants[], createdAt
- **Messages**: senderId, text, createdAt (subcollection of chats)

## Key Features
1. Google authentication with Firebase
2. Interactive map with user pins
3. YouTube music playback per pin
4. Real-time 1-to-1 chat between users

## Development Guidelines
- Use Valentine-themed colors (pinks, reds, soft pastels)
- Mobile-first responsive design
- Real-time updates with Firestore listeners
- One pin per user (MVP constraint)
