"use client"

import { createClient } from '@/utils/supabase/client'
import { User } from '@supabase/supabase-js'
import { createContext, useContext, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

type UserContextType = {
    user: User | null
    loading: boolean
    refreshUser: () => Promise<void>
}

const UserContext = createContext<UserContextType>({
    user: null,
    loading: true,
    refreshUser: async () => { }
})

export function UserProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null)
    const [loading, setLoading] = useState(true)
    const router = useRouter()
    const supabase = createClient()

    const refreshUser = async () => {
        setLoading(true)
        try {
            const { data } = await supabase.auth.getUser()
            // Explicitly set to null if no user to ensure consistent state
            setUser(data?.user || null)
        } catch (error) {
            console.error("Error refreshing user:", error)
            setUser(null)
        } finally {
            setLoading(false)
            router.refresh()
        }
    }

    // This function will be called by the auth listener
    const handleAuthChange = async (event: string, session: any) => {
        console.log("Auth state changed:", event, session?.user?.id || "No user")

        // Update our state immediately
        if (event === 'SIGNED_OUT') {
            // Force immediate null user on sign out
            setUser(null)
        } else {
            // For other events, get the user data correctly
            setUser(session?.user || null)
        }

        setLoading(false)

        // Force router refresh to update server components on auth events
        if (['SIGNED_IN', 'SIGNED_OUT', 'USER_UPDATED'].includes(event)) {
            router.refresh()
        }
    }

    // Effect to setup initial auth state and subscribe to changes
    useEffect(() => {
        // Get initial user
        const getInitialUser = async () => {
            try {
                const { data } = await supabase.auth.getUser()
                setUser(data?.user || null)
            } catch (error) {
                console.error("Error getting initial user:", error)
                setUser(null)
            } finally {
                setLoading(false)
            }
        }

        getInitialUser()

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(handleAuthChange)

        return () => {
            subscription.unsubscribe()
        }
    }, [router])

    return (
        <UserContext.Provider value={{ user, loading, refreshUser }}>
            {children}
        </UserContext.Provider>
    )
}

export const useUser = () => useContext(UserContext) 