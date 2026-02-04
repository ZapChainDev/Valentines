# 💕 HeartMap

A Valentine's-themed web app where users log in with Google, drop a love status on a global map, attach a YouTube song, and chat in real time with other users.

![HeartMap Preview](https://via.placeholder.com/800x400/fda4af/ffffff?text=HeartMap+Preview)

## ✨ Features

- **🔐 Google Authentication** - Secure login with Firebase Auth
- **🗺️ Interactive Map** - Drop your love pin anywhere in the world
- **🎵 Music Sharing** - Attach a YouTube song to your pin
- **💬 Real-time Chat** - Connect with other users through 1-to-1 messaging
- **📍 Location-based** - Your pin appears at your current location
- **💗 Valentine Theme** - Beautiful pink and rose color scheme

## 🛠️ Tech Stack

- **Framework**: [Next.js 14](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) + [shadcn/ui](https://ui.shadcn.com/)
- **Authentication**: [Firebase Auth](https://firebase.google.com/docs/auth) (Google)
- **Database**: [Firestore](https://firebase.google.com/docs/firestore) (real-time)
- **Maps**: [Leaflet](https://leafletjs.com/) + [OpenStreetMap](https://www.openstreetmap.org/)
- **Music**: YouTube Embed API

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- A Firebase project

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd Valentines
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up Firebase

1. Go to the [Firebase Console](https://console.firebase.google.com/)
2. Create a new project (or use an existing one)
3. Enable **Authentication** and add Google as a sign-in provider
4. Enable **Firestore Database** in production mode
5. Get your Firebase config from Project Settings

### 4. Configure environment variables

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

### 5. Set up Firestore Security Rules

In your Firebase Console, go to Firestore Database → Rules and add:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users collection
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.uid == userId;
    }

    // Pins collection
    match /pins/{pinId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null;
      allow update, delete: if request.auth != null && resource.data.userId == request.auth.uid;
    }

    // Chats collection
    match /chats/{chatId} {
      allow read, write: if request.auth != null &&
        request.auth.uid in resource.data.participants;
      allow create: if request.auth != null;

      // Messages subcollection
      match /messages/{messageId} {
        allow read: if request.auth != null;
        allow create: if request.auth != null;
      }
    }
  }
}
```

### 6. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
├── app/                    # Next.js App Router pages
│   ├── globals.css         # Global styles with Valentine theme
│   ├── layout.tsx          # Root layout with providers
│   └── page.tsx            # Main page component
├── components/
│   ├── ui/                 # shadcn/ui components
│   ├── auth/               # Authentication components
│   ├── map/                # Map-related components
│   └── chat/               # Chat components
├── hooks/                  # Custom React hooks
│   ├── use-chat.ts         # Real-time chat hook
│   ├── use-geolocation.ts  # Browser geolocation hook
│   ├── use-pins.ts         # Firestore pins listener
│   └── use-toast.ts        # Toast notifications
├── lib/
│   ├── firebase/           # Firebase configuration
│   └── utils.ts            # Utility functions
├── types/                  # TypeScript type definitions
└── public/                 # Static assets
```

## 📊 Data Models

### Users

```typescript
{
  userId: string;
  nickname: string;
  createdAt: timestamp;
}
```

### Pins

```typescript
{
  userId: string;
  nickname: string;
  status: string;
  youtubeId: string;
  lat: number;
  lng: number;
  createdAt: timestamp;
}
```

### Chats

```typescript
{
  chatId: string;
  participants: [userId1, userId2];
  createdAt: timestamp;
}
```

### Messages (subcollection of chats)

```typescript
{
  senderId: string;
  text: string;
  createdAt: timestamp;
}
```

## 🎨 Customization

### Colors

The Valentine color theme is defined in `tailwind.config.ts`. Primary colors use rose/pink shades:

- Primary: `hsl(346, 77%, 50%)` - Rose red
- Secondary: `hsl(330, 81%, 95%)` - Light pink
- Accent: Gradient from rose-500 to pink-500

### Adding Custom Animations

Custom animations are defined in `tailwind.config.ts`:

- `pulse-heart` - Gentle heart pulsing effect
- `float` - Floating animation for buttons

## 🔒 Security Features

- Anonymous nicknames only (no real names required)
- Message rate limiting (20 messages per minute)
- Firebase security rules for data protection
- One pin per user (MVP constraint)

## 🚧 Roadmap (Post-MVP)

- [ ] Block/report user functionality
- [ ] Media sharing in chat
- [ ] Group chat support
- [ ] Message reactions
- [ ] Read receipts
- [ ] Profanity filter
- [ ] Push notifications

## 📝 License

MIT License - feel free to use this project for your own Valentine's celebrations! 💕

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

Made with 💕 for Valentine's Day
