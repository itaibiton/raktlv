import { useParams } from 'next/navigation';
import { Locale } from '@/i18n-config';

export function useRtl() {
    const params = useParams();
    const lang = params?.lang as Locale;

    const isRtl = lang === 'he';

    return {
        isRtl,
        dir: isRtl ? 'rtl' : 'ltr',
        textAlign: isRtl ? 'right' : 'left',
        start: isRtl ? 'right' : 'left',
        end: isRtl ? 'left' : 'right',
        marginStart: isRtl ? 'mr' : 'ml',
        marginEnd: isRtl ? 'ml' : 'mr',
        paddingStart: isRtl ? 'pr' : 'pl',
        paddingEnd: isRtl ? 'pl' : 'pr',
    };
} 