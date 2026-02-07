# Seed Dummy Data for HeartMap

Since the seeding script requires authentication, you can add these accounts manually through Firebase Console:

## Option 1: Firebase Console (Recommended)

Go to Firebase Console → Firestore Database and create these documents:

### Users Collection

1. **Document ID: `dummy_user_1`**

   ```
   userId: "dummy_user_1"
   nickname: "Maria ❤️"
   createdAt: [Current Timestamp]
   ```

2. **Document ID: `dummy_user_2`**
   ```
   userId: "dummy_user_2"
   nickname: "Juan 💑"
   createdAt: [Current Timestamp]
   ```

3-10: Repeat for remaining users (see seed-dummy-data.ts for full list)

### Pins Collection

1. **Auto-generated ID**
   ```
   userId: "dummy_user_1"
   nickname: "Maria ❤️"
   status: "💕 In love"
   youtubeId: "kJQP7kiw5Fk"
   lat: 11.7800
   lng: 124.6950
   createdAt: [Current Timestamp]
   ```

Repeat for all 10 accounts, varying lat/lng around Catbalogan (11.7756, 124.6906)

## Option 2: Temporary Rule Update

Temporarily update Firestore rules to allow writes without auth, run the seed script, then restore rules:

1. In Firebase Console, temporarily change rules:

   ```
   allow read, write: if true;  // TEMPORARY - REMOVE AFTER SEEDING
   ```

2. Run: `npm run seed`

3. Immediately restore original security rules

## Option 3: Use your authenticated account

Simply log into the app with your Google account and manually create pins in different locations around Catbalogan by:

1. Changing your browser's geolocation
2. Creating a pin
3. Logging out
4. Creating new account
5. Repeat

---

**Coordinates for Catbalogan area:**

- Center: 11.7756° N, 124.6906° E
- Spread pins within ±0.045° (~5km radius)
