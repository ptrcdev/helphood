"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { User } from "../entitites/user";
import { useSession } from "next-auth/react";

/**
 * The profile interface is the same as the User interface. So we'll be using that.
 */

interface ProfileContextType {
    profile: User | null;
    setProfile: (profile: User | null) => void;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export const ProfileProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [profile, setProfile] = useState<User | null>(null);
    const { data: session, status } = useSession();

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const userId = status === "authenticated" ? session?.user?.userId : null;

                if (!userId) return;

                const response = await fetch(`/api/users/${userId}`);
                const data = await response.json();
                setProfile(data.user);
            } catch (error) {
                console.error("Error fetching profile", error);
            }
        };

        fetchProfile();
    }, [session]);

    return (
        <ProfileContext.Provider value={{ profile, setProfile }}>
            {children}
        </ProfileContext.Provider>
    );
}

// Custom hook to easily use the profile context
export const useProfile = () => {
    const context = useContext(ProfileContext);

    if (!context) {
        throw new Error("useProfile must be used within a ProfileProvider");
    }

    return context;
}