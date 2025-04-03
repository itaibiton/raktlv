'use server';

import { revalidatePath } from 'next/cache';

// Utility function to revalidate the properties page after auth actions
export async function revalidateProperties() {
    revalidatePath('/[lang]/(properties)/properties');
} 