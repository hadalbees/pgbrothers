"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { X } from "lucide-react";
import {
  seedDBIfEmpty,
  getGallery,
  saveGallery,
  getPlayers,
  savePlayer,
  deletePlayer,
  getAchievements,
  saveAchievement,
  deleteAchievement,
  getOverrides,
  saveOverride,
  clearOverride,
  resetDB,
  GalleryImage,
  PlayerProfile,
  AchievementItem,
  ClubDetails,
  getClubDetails,
  saveClubDetails,
  defaultClubDetails,
} from "@/utils/db";

// Configurable static admin passcode
export const ADMIN_PASSCODE = "Target*Sports";

interface ImageContextType {
  gallery: GalleryImage[];
  players: PlayerProfile[];
  achievements: AchievementItem[];
  overrides: Record<string, string>;
  loading: boolean;
  isAdmin: boolean;
  login: (passcode: string) => boolean;
  logout: () => void;
  getImageSrc: (path: string) => string;
  updateImageOverride: (path: string, file: File) => Promise<void>;
  resetImageOverride: (path: string) => Promise<void>;
  updateGalleryImages: (images: GalleryImage[]) => Promise<void>;
  addOrUpdatePlayerProfile: (player: PlayerProfile, imageFile?: File | null) => Promise<void>;
  removePlayerProfile: (id: string) => Promise<void>;
  addOrUpdateAchievement: (achievement: AchievementItem, imageFile?: File | null) => Promise<void>;
  removeAchievement: (id: string) => Promise<void>;
  resetAllToDefault: () => Promise<void>;
  openLoginModal: () => void;
  clubDetails: ClubDetails;
  updateClubDetails: (details: ClubDetails) => Promise<void>;
}

const ImageContext = createContext<ImageContextType | undefined>(undefined);

// On-the-fly client-side image compression
export function compressImage(file: File, maxWidth = 1200, maxHeight = 1200): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new window.Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          resolve(event.target?.result as string); // fallback to original size
          return;
        }
        ctx.drawImage(img, 0, 0, width, height);
        // Compress as image/jpeg at 0.8 quality
        const compressedBase64 = canvas.toDataURL("image/jpeg", 0.8);
        resolve(compressedBase64);
      };
      img.onerror = (err) => reject(err);
    };
    reader.onerror = (err) => reject(err);
  });
}

export function EditableImageProvider({ children }: { children: React.ReactNode }) {
  const [gallery, setGallery] = useState<GalleryImage[]>([]);
  const [players, setPlayers] = useState<PlayerProfile[]>([]);
  const [achievements, setAchievements] = useState<AchievementItem[]>([]);
  const [overrides, setOverrides] = useState<Record<string, string>>({});
  const [clubDetails, setClubDetails] = useState<ClubDetails>(defaultClubDetails);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [passcode, setPasscode] = useState("");
  const [loginError, setLoginError] = useState("");

  const openLoginModal = () => setShowLoginModal(true);

  // Helper to save current local state to Cloudflare R2
  const syncToCloudflare = async (updates: {
    gallery?: GalleryImage[];
    players?: PlayerProfile[];
    achievements?: AchievementItem[];
    overrides?: Record<string, string>;
    clubDetails?: ClubDetails;
  }) => {
    try {
      const payload = {
        gallery: updates.gallery !== undefined ? updates.gallery : gallery,
        players: updates.players !== undefined ? updates.players : players,
        achievements: updates.achievements !== undefined ? updates.achievements : achievements,
        overrides: updates.overrides !== undefined ? updates.overrides : overrides,
        clubDetails: updates.clubDetails !== undefined ? updates.clubDetails : clubDetails,
      };

      const res = await fetch("/api/db", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-passcode": ADMIN_PASSCODE,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        console.error("Failed to sync database to Cloudflare R2:", await res.text());
      }
    } catch (err) {
      console.error("Network error when syncing to Cloudflare R2:", err);
    }
  };

  // Load database content on mount
  useEffect(() => {
    async function initAndLoad() {
      try {
        const res = await fetch("/api/db");
        if (res.ok) {
          const data = (await res.json()) as any;
          if (data && data.gallery && data.players && data.achievements && data.clubDetails) {
            setGallery(data.gallery);
            setPlayers(data.players);
            setAchievements(data.achievements);
            setOverrides(data.overrides || {});
            setClubDetails(data.clubDetails);

            // Sync locally to IndexedDB as background cache
            seedDBIfEmpty().then(async () => {
              await saveGallery(data.gallery);
              // Store all objects in IndexedDB to keep them local too
              for (const player of data.players) {
                await savePlayer(player);
              }
              for (const ach of data.achievements) {
                await saveAchievement(ach);
              }
              for (const [path, base64] of Object.entries(data.overrides || {})) {
                await saveOverride(path, base64 as string);
              }
              await saveClubDetails(data.clubDetails);
            }).catch(e => console.error("Local DB sync error:", e));

            const adminSession = sessionStorage.getItem("pgb_admin_session");
            setIsAdmin(adminSession === "true");
            setLoading(false);
            return;
          }
        }
      } catch (err) {
        console.warn("Cloudflare R2 fetch failed, falling back to local IndexedDB:", err);
      }

      // Fallback: load from local IndexedDB
      try {
        await seedDBIfEmpty();
        const loadedGallery = await getGallery();
        const loadedPlayers = await getPlayers();
        const loadedAchievements = await getAchievements();
        const loadedOverrides = await getOverrides();
        const loadedClubDetails = await getClubDetails();
 
        setGallery(loadedGallery);
        setPlayers(loadedPlayers);
        setAchievements(loadedAchievements);
        setOverrides(loadedOverrides);
        setClubDetails(loadedClubDetails);

        const adminSession = sessionStorage.getItem("pgb_admin_session");
        setIsAdmin(adminSession === "true");
      } catch (err) {
        console.error("Failed to load IndexedDB data", err);
      } finally {
        setLoading(false);
      }
    }
    initAndLoad();

    // Listen to pageshow to handle back/forward cache state restoration
    const handlePageShow = () => {
      const adminSession = sessionStorage.getItem("pgb_admin_session");
      setIsAdmin(adminSession === "true");
    };

    window.addEventListener("pageshow", handlePageShow);
    return () => {
      window.removeEventListener("pageshow", handlePageShow);
    };
  }, [gallery, players, achievements, overrides, clubDetails]);

  // Login handler
  const login = (passcode: string): boolean => {
    if (passcode === ADMIN_PASSCODE) {
      setIsAdmin(true);
      sessionStorage.setItem("pgb_admin_session", "true");
      return true;
    }
    return false;
  };

  // Logout handler
  const logout = () => {
    setIsAdmin(false);
    sessionStorage.removeItem("pgb_admin_session");
  };

  // Helper to resolve an image source URL (returns override or default path)
  const getImageSrc = (path: string): string => {
    return overrides[path] || path;
  };

  // Add/replace an image path override
  const updateImageOverride = async (path: string, file: File) => {
    try {
      const compressedBase64 = await compressImage(file);
      await saveOverride(path, compressedBase64);
      const newOverrides = {
        ...overrides,
        [path]: compressedBase64,
      };
      setOverrides(newOverrides);
      await syncToCloudflare({ overrides: newOverrides });
    } catch (err) {
      console.error(`Failed to override image path: ${path}`, err);
      throw err;
    }
  };

  // Clear/reset an image override back to default
  const resetImageOverride = async (path: string) => {
    try {
      await clearOverride(path);
      const newOverrides = { ...overrides };
      delete newOverrides[path];
      setOverrides(newOverrides);
      await syncToCloudflare({ overrides: newOverrides });
    } catch (err) {
      console.error(`Failed to reset image path: ${path}`, err);
    }
  };

  // Update gallery images array (allows adding, deleting, and editing gallery items)
  const updateGalleryImages = async (newGallery: GalleryImage[]) => {
    try {
      await saveGallery(newGallery);
      setGallery(newGallery);
      await syncToCloudflare({ gallery: newGallery });
    } catch (err) {
      console.error("Failed to update gallery", err);
      throw err;
    }
  };

  // Add or update player profiles
  const addOrUpdatePlayerProfile = async (player: PlayerProfile, imageFile?: File | null) => {
    try {
      let finalImageSrc = player.imageSrc;
      if (imageFile) {
        finalImageSrc = await compressImage(imageFile, 600, 800); // profile layout aspect ratio
      }
      
      const updatedPlayer = {
        ...player,
        imageSrc: finalImageSrc,
      };

      await savePlayer(updatedPlayer);
      
      const reloadedPlayers = await getPlayers();
      setPlayers(reloadedPlayers);
      await syncToCloudflare({ players: reloadedPlayers });
    } catch (err) {
      console.error("Failed to save player profile", err);
      throw err;
    }
  };

  // Delete player profiles
  const removePlayerProfile = async (id: string) => {
    try {
      await deletePlayer(id);
      const reloadedPlayers = await getPlayers();
      setPlayers(reloadedPlayers);
      await syncToCloudflare({ players: reloadedPlayers });
    } catch (err) {
      console.error("Failed to delete player profile", err);
      throw err;
    }
  };

  // Add or update achievement (moment) items
  const addOrUpdateAchievement = async (achievement: AchievementItem, imageFile?: File | null) => {
    try {
      let finalImageSrc = achievement.imageSrc;
      if (imageFile) {
        finalImageSrc = await compressImage(imageFile, 1200, 900); // landscape aspect ratio
      }
      
      const updatedAchievement = {
        ...achievement,
        imageSrc: finalImageSrc,
      };

      await saveAchievement(updatedAchievement);
      
      const reloadedAchievements = await getAchievements();
      setAchievements(reloadedAchievements);
      await syncToCloudflare({ achievements: reloadedAchievements });
    } catch (err) {
      console.error("Failed to save achievement", err);
      throw err;
    }
  };

  // Delete achievement items
  const removeAchievement = async (id: string) => {
    try {
      await deleteAchievement(id);
      const reloadedAchievements = await getAchievements();
      setAchievements(reloadedAchievements);
      await syncToCloudflare({ achievements: reloadedAchievements });
    } catch (err) {
      console.error("Failed to delete achievement", err);
      throw err;
    }
  };

  // Update club details
  const updateClubDetails = async (details: ClubDetails) => {
    try {
      await saveClubDetails(details);
      setClubDetails(details);
      await syncToCloudflare({ clubDetails: details });
    } catch (err) {
      console.error("Failed to update club details", err);
      throw err;
    }
  };

  // Reset entire database back to default factory seed state
  const resetAllToDefault = async () => {
    try {
      setLoading(true);
      await resetDB();
      const loadedGallery = await getGallery();
      const loadedPlayers = await getPlayers();
      const loadedAchievements = await getAchievements();
      const loadedOverrides = await getOverrides();
      const loadedClubDetails = await getClubDetails();
 
      setGallery(loadedGallery);
      setPlayers(loadedPlayers);
      setAchievements(loadedAchievements);
      setOverrides(loadedOverrides);
      setClubDetails(loadedClubDetails);

      await syncToCloudflare({
        gallery: loadedGallery,
        players: loadedPlayers,
        achievements: loadedAchievements,
        overrides: loadedOverrides,
        clubDetails: loadedClubDetails,
      });
    } catch (err) {
      console.error("Failed to reset database", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ImageContext.Provider
      value={{
        gallery,
        players,
        achievements,
        overrides,
        loading,
        isAdmin,
        login,
        logout,
        getImageSrc,
        updateImageOverride,
        resetImageOverride,
        updateGalleryImages,
        addOrUpdatePlayerProfile,
        removePlayerProfile,
        addOrUpdateAchievement,
        removeAchievement,
        resetAllToDefault,
        openLoginModal,
        clubDetails,
        updateClubDetails,
      }}
    >
      {children}

      {/* LOGIN MODAL */}
      {showLoginModal && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm">
          <div className="w-full max-w-md bg-[#161616] border border-gold/30 p-8 relative shadow-2xl">
            <button
              onClick={() => {
                setShowLoginModal(false);
                setLoginError("");
                setPasscode("");
              }}
              className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-2xl font-oswald font-bold text-white uppercase tracking-wider mb-2">
              Admin Access
            </h3>
            <p className="text-gray-400 text-xs mb-6 font-light">
              Enter the static passcode to enable client-side site modification.
            </p>
            
            <form onSubmit={(e) => {
              e.preventDefault();
              const success = login(passcode);
              if (success) {
                setShowLoginModal(false);
                setPasscode("");
                setLoginError("");
              } else {
                setLoginError("Invalid passcode.");
              }
            }}>
              <div className="mb-6">
                <label className="block text-[9px] font-bold uppercase tracking-widest text-gray-400 mb-2">
                  Passcode
                </label>
                <input
                  type="password"
                  value={passcode}
                  onChange={(e) => setPasscode(e.target.value)}
                  placeholder="Enter passcode"
                  autoFocus
                  className="w-full px-4 py-3 bg-[#0f0f0f] border border-white/10 focus:border-gold text-white text-xs rounded-none focus:outline-none transition-colors"
                />
                {loginError && (
                  <p className="text-red-500 text-[10px] mt-2 font-semibold">{loginError}</p>
                )}
              </div>
              
              <button
                type="submit"
                className="w-full py-3 bg-gold text-charcoal font-bold uppercase tracking-widest hover:bg-white transition-colors duration-300 text-xs cursor-pointer"
              >
                Authenticate
              </button>
            </form>
          </div>
        </div>
      )}
    </ImageContext.Provider>
  );
}

export function useEditableImages() {
  const context = useContext(ImageContext);
  if (context === undefined) {
    throw new Error("useEditableImages must be used within an EditableImageProvider");
  }
  return context;
}
