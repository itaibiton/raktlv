import { createClient } from '@/utils/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

type tParams = Promise<{ lang: string }>;


export async function GET(
    request: NextRequest,
    context: { params: tParams }
): Promise<NextResponse> {
    const requestUrl = new URL(request.url);
    const code = requestUrl.searchParams.get('code');
    const redirect_to = requestUrl.searchParams.get('redirect_to') || '/';

    const { lang } = await context.params;
    if (code) {
        const supabase = await createClient();
        await supabase.auth.exchangeCodeForSession(code);
    }

    return NextResponse.redirect(new URL(`/${lang}${redirect_to}`, requestUrl.origin));
}

