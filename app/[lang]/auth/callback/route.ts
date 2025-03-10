import { createClient } from '@/utils/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
    request: NextRequest,
    { params }: { params: { lang: string } }
) {
    const requestUrl = new URL(request.url);
    const code = requestUrl.searchParams.get('code');
    const redirect_to = requestUrl.searchParams.get('redirect_to') || '/';
    const lang = params.lang;

    if (code) {
        const supabase = await createClient();
        await supabase.auth.exchangeCodeForSession(code);
    }

    // URL to redirect to after sign in process completes
    // Include the lang in the redirect URL
    return NextResponse.redirect(new URL(`/${lang}${redirect_to}`, requestUrl.origin));
}