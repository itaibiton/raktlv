'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { Loader2 } from 'lucide-react';

export default function SessionSync() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const redirectTo = searchParams.get('redirect') || '/';

    useEffect(() => {
        // Force a refresh of the Supabase client's auth state
        const supabase = createClient();

        // This will trigger a refresh of the auth state
        const refreshAuthState = async () => {
            // Get the current session - this forces a refresh of the auth state
            await supabase.auth.getSession();

            // Redirect to the intended destination
            router.push(redirectTo);
        };

        refreshAuthState();
    }, [redirectTo, router]);

    return (
        <div className="flex items-center justify-center min-h-screen">
            <Loader2 className="w-10 h-10 animate-spin" />
        </div>
    );
} 