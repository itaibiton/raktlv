"use client"

import { createClient } from '@/utils/supabase/client'
import { User } from '@supabase/supabase-js'
import { createContext, useContext, useEffect, useState } from 'react'

type UserContextType = {
    user: User | null
    loading: boolean
}

const UserContext = createContext<UserContextType>({
    user: null,
    loading: true
})

export function UserProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null)
    const [loading, setLoading] = useState(true)
    const supabase = createClient()

    useEffect(() => {
        // Get initial user
        const getUser = async () => {
            const { data: { user } } = await supabase.auth.getUser()
            setUser(user)
            setLoading(false)
        }
        getUser()

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null)
            setLoading(false)
        })

        return () => {
            subscription.unsubscribe()
        }
    }, [])

    return (
        <UserContext.Provider value={{ user, loading }}>
            {children}
        </UserContext.Provider>
    )
}

export const useUser = () => useContext(UserContext) 