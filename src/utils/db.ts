export interface GalleryImage {
  src: string;
  title: string;
  description: string;
  categories: string[];
}

export interface PlayerProfile {
  id: string;
  name: string;
  position: string;
  team: string;
  focus: string;
  quote: string;
  imageSrc: string; // base64 or empty string (uses silhouette)
}

export interface AchievementItem {
  id: string;
  imageSrc: string; // base64 or default path string
  category: string;
  title: string;
  description: string;
}

export interface ImageOverride {
  path: string;
  base64: string;
}

export interface ClubDetails {
  name: string;
  affiliation: string;
  address: string;
  phone: string;
  email: string;
  president: string;
  vicePresident: string;
  secretary: string;
  joinSecretary: string;
  treasurer: string;
}

export const defaultClubDetails: ClubDetails = {
  name: "PG Brothers Kabaddi Club",
  affiliation: "Affiliated to Chennai District Amateur Kabaddi Association",
  address: "1 cross saibaba colony, Virugambakkam, Chennai - 600092",
  phone: "94450 12641",
  email: "pgbrotherskabadi@gmail.com",
  president: "S.Karthikeyan",
  vicePresident: "V.Sathish Kumar Iyappan",
  secretary: "S.Maran",
  joinSecretary: "R.Nirmal Raj Mohan",
  treasurer: "V.Ranjith Kumar",
};

const DB_NAME = "pgbrothers_db";
const DB_VERSION = 2; // Incremented to support achievements store upgrade

export const defaultGallery: GalleryImage[] = [
  {
    src: "/images/team_group.jpg",
    title: "TEAM • UNITY",
    description: "The official team photo of the P.G. Brothers squad, celebrating collective dedication and team spirit.",
    categories: ["TEAMS", "TOURNAMENTS"],
  },
  {
    src: "/images/cup_presentation.jpg",
    title: "VICTORY • PRESENTATION",
    description: "Honoring the team's outstanding performers and celebrating tournament achievements.",
    categories: ["PLAYERS", "TROPHIES", "TOURNAMENTS"],
  },
  {
    src: "/images/grassroots_support.png",
    title: "THE JOURNEY • CONTINUES",
    description: "Encouraging a young athlete with sporting gear to support his training and progression.",
    categories: ["COMMUNITY", "PLAYERS"],
  },
  {
    src: "/images/tournament_group.jpg",
    title: "COMMUNITY • CELEBRATION",
    description: "Teams, organizers, and supporters coming together under the banner of sportsmanship.",
    categories: ["TEAMS", "TOURNAMENTS", "COMMUNITY"],
  },
  {
    src: "/images/player_lineup.jpg",
    title: "COMPETITION • RESPECT",
    description: "Players lining up under field lights, greeting guests and demonstrating respect before the whistle blows.",
    categories: ["TEAMS", "TOURNAMENTS", "COMMUNITY"],
  },
];

export const defaultPlayers: PlayerProfile[] = [
  {
    id: "player_1",
    name: "Vikram Singh",
    position: "Raider",
    team: "P.G. Brothers",
    focus: "Grassroots Development",
    quote: "Dedication in training prepares athletes for opportunities. The mat rewards hard work and persistence.",
    imageSrc: "",
  },
  {
    id: "player_2",
    name: "Rahul Kumar",
    position: "Right Corner Defender",
    team: "P.G. Brothers",
    focus: "Local Tournaments",
    quote: "Defense is not just about blocking, it is about trust and instant synchronization with your team.",
    imageSrc: "",
  },
  {
    id: "player_3",
    name: "Sandeep Sharma",
    position: "All-Rounder",
    team: "P.G. Brothers",
    focus: "Junior Division",
    quote: "Every raid and every tackle is a lesson. Resilience is key to keeping the game moving forward.",
    imageSrc: "",
  },
];

export const defaultAchievements: AchievementItem[] = [
  {
    id: "moment_1",
    imageSrc: "/images/team_group.jpg",
    category: "TEAM • UNITY",
    title: "Championship Team Group",
    description: "The official team photo of the P.G. Brothers squad, celebrating collective dedication and team spirit.",
  },
  {
    id: "moment_2",
    imageSrc: "/images/cup_presentation.jpg",
    category: "VICTORY • PRESENTATION",
    title: "Championship Award Presentation",
    description: "Honoring the team's outstanding performers and celebrating tournament achievements.",
  },
  {
    id: "moment_3",
    imageSrc: "/images/grassroots_support.png",
    category: "THE JOURNEY • CONTINUES",
    title: "Grassroots Athlete Encouragement",
    description: "Providing shoes and training gear to a talented player, fueling the dreams of the community.",
  },
  {
    id: "moment_4",
    imageSrc: "/images/tournament_group.jpg",
    category: "COMMUNITY • CELEBRATION",
    title: "Grand Tournament Gathering",
    description: "Teams, organizers, and supporters coming together under the banner of sportsmanship.",
  },
  {
    id: "moment_5",
    imageSrc: "/images/player_lineup.jpg",
    category: "COMPETITION • RESPECT",
    title: "Pre-Match Player Lineup",
    description: "Players lining up under field lights, greeting guests and demonstrating respect before the whistle blows.",
  },
];

// Open DB Helper
function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === "undefined") {
      reject("IndexedDB is not supported on server-side");
      return;
    }
    const request = window.indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = request.result;
      if (!db.objectStoreNames.contains("gallery")) {
        db.createObjectStore("gallery", { keyPath: "src" });
      }
      if (!db.objectStoreNames.contains("players")) {
        db.createObjectStore("players", { keyPath: "id" });
      }
      if (!db.objectStoreNames.contains("overrides")) {
        db.createObjectStore("overrides", { keyPath: "path" });
      }
      if (!db.objectStoreNames.contains("achievements")) {
        db.createObjectStore("achievements", { keyPath: "id" });
      }
    };

    request.onsuccess = () => {
      resolve(request.result);
    };

    request.onerror = () => {
      reject(request.error);
    };
  });
}

// Check and Seed Database if Empty
export async function seedDBIfEmpty(): Promise<void> {
  if (typeof window === "undefined") return;
  try {
    const db = await openDB();
    
    // Seed Gallery
    const galleryCount = await countItems(db, "gallery");
    if (galleryCount === 0) {
      await saveBatch(db, "gallery", defaultGallery);
    }

    // Seed Players
    const playersCount = await countItems(db, "players");
    if (playersCount === 0) {
      await saveBatch(db, "players", defaultPlayers);
    }

    // Seed Achievements
    const achievementsCount = await countItems(db, "achievements");
    if (achievementsCount === 0) {
      await saveBatch(db, "achievements", defaultAchievements);
    }
  } catch (err) {
    console.error("IndexedDB seeding error:", err);
  }
}

// Database Helpers
function countItems(db: IDBDatabase, storeName: string): Promise<number> {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(storeName, "readonly");
    const store = transaction.objectStore(storeName);
    const request = store.count();

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

function saveBatch(db: IDBDatabase, storeName: string, items: any[]): Promise<void> {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(storeName, "readwrite");
    const store = transaction.objectStore(storeName);

    items.forEach((item) => {
      store.put(item);
    });

    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error);
  });
}

// Public API Functions

// 1. Gallery CRUD
export async function getGallery(): Promise<GalleryImage[]> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction("gallery", "readonly");
    const store = transaction.objectStore("gallery");
    const request = store.getAll();

    request.onsuccess = () => resolve(request.result || []);
    request.onerror = () => reject(request.error);
  });
}

export async function saveGallery(gallery: GalleryImage[]): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction("gallery", "readwrite");
    const store = transaction.objectStore("gallery");
    
    // Clear old records to allow full synchronization (e.g. deletions/replaces)
    const clearRequest = store.clear();
    clearRequest.onsuccess = () => {
      gallery.forEach((item) => {
        store.put(item);
      });
    };

    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error);
  });
}

// 2. Players CRUD
export async function getPlayers(): Promise<PlayerProfile[]> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction("players", "readonly");
    const store = transaction.objectStore("players");
    const request = store.getAll();

    request.onsuccess = () => resolve(request.result || []);
    request.onerror = () => reject(request.error);
  });
}

export async function savePlayer(player: PlayerProfile): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction("players", "readwrite");
    const store = transaction.objectStore("players");
    const request = store.put(player);

    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

export async function deletePlayer(id: string): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction("players", "readwrite");
    const store = transaction.objectStore("players");
    const request = store.delete(id);

    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

// 3. Achievements / Moments CRUD
export async function getAchievements(): Promise<AchievementItem[]> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction("achievements", "readonly");
    const store = transaction.objectStore("achievements");
    const request = store.getAll();

    request.onsuccess = () => resolve(request.result || []);
    request.onerror = () => reject(request.error);
  });
}

export async function saveAchievement(achievement: AchievementItem): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction("achievements", "readwrite");
    const store = transaction.objectStore("achievements");
    const request = store.put(achievement);

    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

export async function deleteAchievement(id: string): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction("achievements", "readwrite");
    const store = transaction.objectStore("achievements");
    const request = store.delete(id);

    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

// 4. Image Overrides CRUD
export async function getOverrides(): Promise<Record<string, string>> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction("overrides", "readonly");
    const store = transaction.objectStore("overrides");
    const request = store.getAll();

    request.onsuccess = () => {
      const result: Record<string, string> = {};
      (request.result || []).forEach((item: ImageOverride) => {
        result[item.path] = item.base64;
      });
      resolve(result);
    };
    request.onerror = () => reject(request.error);
  });
}

export async function saveOverride(path: string, base64: string): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction("overrides", "readwrite");
    const store = transaction.objectStore("overrides");
    const request = store.put({ path, base64 });

    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

export async function clearOverride(path: string): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction("overrides", "readwrite");
    const store = transaction.objectStore("overrides");
    const request = store.delete(path);

    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

// Reset Entire DB to Seed Defaults
export async function resetDB(): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(["gallery", "players", "achievements", "overrides"], "readwrite");
    
    transaction.objectStore("gallery").clear();
    transaction.objectStore("players").clear();
    transaction.objectStore("achievements").clear();
    transaction.objectStore("overrides").clear();

    transaction.oncomplete = async () => {
      try {
        await saveBatch(db, "gallery", defaultGallery);
        await saveBatch(db, "players", defaultPlayers);
        await saveBatch(db, "achievements", defaultAchievements);
        resolve();
      } catch (err) {
        reject(err);
      }
    };
    transaction.onerror = () => reject(transaction.error);
  });
}

// Club Details DB Access
export async function getClubDetails(): Promise<ClubDetails> {
  const db = await openDB();
  return new Promise((resolve) => {
    const transaction = db.transaction("overrides", "readonly");
    const store = transaction.objectStore("overrides");
    const request = store.get("club_details");
    request.onsuccess = () => {
      if (request.result && request.result.base64) {
        try {
          resolve(JSON.parse(request.result.base64));
          return;
        } catch (e) {
          console.error("Failed to parse club details", e);
        }
      }
      resolve(defaultClubDetails);
    };
    request.onerror = () => {
      resolve(defaultClubDetails);
    };
  });
}

export async function saveClubDetails(details: ClubDetails): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction("overrides", "readwrite");
    const store = transaction.objectStore("overrides");
    const request = store.put({ path: "club_details", base64: JSON.stringify(details) });
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}
