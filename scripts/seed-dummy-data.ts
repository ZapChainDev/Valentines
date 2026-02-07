import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  addDoc,
  setDoc,
  doc,
  serverTimestamp,
  getDocs,
  query,
  where,
  deleteDoc,
} from "firebase/firestore";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD71nRwAU8CJUuGev1GV9w3KrYyE-YIFaE",
  authDomain: "valentines-ae013.firebaseapp.com",
  projectId: "valentines-ae013",
  storageBucket: "valentines-ae013.firebasestorage.app",
  messagingSenderId: "698116779953",
  appId: "1:698116779953:web:9995edbc246aeccaee5790",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Catbalogan City coordinates: 11.7756° N, 124.886° E
const CATBALOGAN_BASE = { lat: 11.7756, lng: 124.886 };

const dummyAccounts = [
  {
    nickname: "Maria ❤️",
    status: "💕 In love",
    youtubeId: "kJQP7kiw5Fk", // Despacito
  },
  {
    nickname: "Juan 💑",
    status: "💍 Engaged",
    youtubeId: "RgKAFK5djSk", // Thinking Out Loud
  },
  {
    nickname: "Sofia 🌹",
    status: "💖 Happily taken",
    youtubeId: "450p7goxZqg", // All of Me
  },
  {
    nickname: "Carlos 💘",
    status: "💑 In a relationship",
    youtubeId: "nfWlot6h_JM", // Shallow
  },
  {
    nickname: "Ana 💝",
    status: "❤️ Married",
    youtubeId: "lp-EO5I60KA", // Perfect
  },
  {
    nickname: "Miguel 🎵",
    status: "💜 Forever yours",
    youtubeId: "SlPhMPnQ58k", // Shape of You
  },
  {
    nickname: "Isabella 💗",
    status: "💓 Single",
    youtubeId: "OPf0YbXqDm0", // Someone Like You
  },
  {
    nickname: "Diego 🌺",
    status: "🔍 Looking for love",
    youtubeId: "e-ORhEE9VVg", // Photograph
  },
  {
    nickname: "Carmen 🦋",
    status: "💕 In love",
    youtubeId: "fRh_vgS2dFE", // Someone You Loved
  },
  {
    nickname: "Rafael 🌟",
    status: "💫 Love is in the air",
    youtubeId: "JGwWNGJdvx8", // See You Again
  },
  {
    nickname: "Elena 💞",
    status: "💖 My heart is full",
    youtubeId: "bo_efYhYU2A", // Sugar
  },
  {
    nickname: "Pedro 🥀",
    status: "💔 Healing",
    youtubeId: "0yW7w8F2TVA", // Happier
  },
  {
    nickname: "Rosa 🌸",
    status: "🦋 Free spirit",
    youtubeId: "CvBfHwUxHIk", // Uptown Funk
  },
  {
    nickname: "Luis 💌",
    status: "💕 Crushing hard",
    youtubeId: "QpbQ4I3Eidg", // Can't Stop the Feeling
  },
  {
    nickname: "Lucia 🌷",
    status: "💗 Taken & happy",
    youtubeId: "7wtfhZwyrcc", // Shake It Off
  },
  {
    nickname: "Marco 🔥",
    status: "🔍 Looking for my soulmate",
    youtubeId: "ru0K8uYEZWw", // Counting Stars
  },
  {
    nickname: "Camila 💫",
    status: "💜 Loving life",
    youtubeId: "hT_nvWreIhg", // Roar
  },
  {
    nickname: "Antonio 🎸",
    status: "🎵 Music is my love",
    youtubeId: "YQHsXMglC9A", // Hello
  },
  {
    nickname: "Valentina 💋",
    status: "💘 Hopelessly romantic",
    youtubeId: "pB-5XG-DbAA", // Love Story
  },
  {
    nickname: "Jose 🌙",
    status: "✨ Dreaming of love",
    youtubeId: "hLQl3WQQoQ0", // A Thousand Years
  },
];

// Generate random offset from base coordinates (within ~5km radius)
function randomOffset() {
  const offset = 0.045; // approximately 5km
  return (Math.random() - 0.5) * offset;
}

async function seedDummyData() {
  console.log("Starting to seed dummy data...");

  try {
    // First, delete old dummy pins
    console.log("Deleting old dummy pins...");
    const pinsRef = collection(db, "pins");
    const allPinsSnap = await getDocs(pinsRef);

    for (const pinDoc of allPinsSnap.docs) {
      const data = pinDoc.data();
      if (data.userId && data.userId.startsWith("dummy_user_")) {
        await deleteDoc(doc(db, "pins", pinDoc.id));
        console.log(`✗ Deleted old pin: ${data.nickname}`);
      }
    }

    console.log("\nCreating new pins at correct location...\n");

    for (let i = 0; i < dummyAccounts.length; i++) {
      const account = dummyAccounts[i];
      const userId = `dummy_user_${i + 1}`;

      // Create user document
      await setDoc(doc(db, "users", userId), {
        userId,
        nickname: account.nickname,
        createdAt: serverTimestamp(),
      });

      console.log(`✓ Created user: ${account.nickname}`);

      // Create pin document
      await addDoc(collection(db, "pins"), {
        userId,
        nickname: account.nickname,
        status: account.status,
        youtubeId: account.youtubeId,
        lat: CATBALOGAN_BASE.lat + randomOffset(),
        lng: CATBALOGAN_BASE.lng + randomOffset(),
        createdAt: serverTimestamp(),
      });

      console.log(`✓ Created pin for: ${account.nickname}`);
    }

    console.log(
      "\n🎉 Successfully seeded 20 dummy accounts in Catbalogan area!",
    );
    console.log("You can now view them on the map.");
  } catch (error) {
    console.error("Error seeding data:", error);
  }
}

seedDummyData();
