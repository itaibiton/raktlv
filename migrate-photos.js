const { createClient } = require('@supabase/supabase-js');
const fetch = require('node-fetch');
const path = require('path');

const supabaseUrl = 'https://dxohrymifwxwyppgvmff.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR4b2hyeW1pZnd4d3lwcGd2bWZmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzg3ODI4NzksImV4cCI6MjA1NDM1ODg3OX0.KsywsCAWs9aXeMoFdflsUMTll0EWCXUq_JfpNDrjKNA';
const supabase = createClient(supabaseUrl, supabaseKey);

async function downloadImage(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`Failed to fetch image: ${response.statusText}`);
        const buffer = await response.buffer();
        return buffer;
    } catch (error) {
        console.error(`Error downloading image from ${url}:`, error);
        return null;
    }
}

async function uploadToSupabase(imageBuffer, filename) {
    try {
        const { data, error } = await supabase.storage
            .from('properties')
            .upload(filename, imageBuffer, {
                contentType: 'image/jpeg',
                cacheControl: '3600'
            });

        if (error) throw error;

        const { data: { publicUrl } } = supabase.storage
            .from('properties')
            .getPublicUrl(filename);

        return publicUrl;
    } catch (error) {
        console.error(`Error uploading to Supabase:`, error);
        return null;
    }
}

async function migratePhotos() {
    try {
        // Get all properties with photos
        const { data: properties, error } = await supabase
            .from('properties')
            .select('property_id, photos')
            .not('photos', 'eq', '{}')
            .not('photos', 'is', null);

        if (error) throw error;

        // Create a map of unique URLs to avoid downloading the same image multiple times
        const uniqueUrls = new Map();
        properties.forEach(property => {
            property.photos.forEach(url => {
                if (!uniqueUrls.has(url)) {
                    uniqueUrls.set(url, {
                        newFilename: `property_${Date.now()}_${Math.random().toString(36).substring(7)}.jpg`,
                        properties: [property.property_id]
                    });
                } else {
                    uniqueUrls.get(url).properties.push(property.property_id);
                }
            });
        });

        // Download and upload each unique image
        for (const [url, { newFilename, properties }] of uniqueUrls.entries()) {
            console.log(`Processing ${url}...`);

            // Download image
            const imageBuffer = await downloadImage(url);
            if (!imageBuffer) continue;

            // Upload to Supabase
            const newUrl = await uploadToSupabase(imageBuffer, newFilename);
            if (!newUrl) continue;

            // Update all properties that use this image
            for (const propertyId of properties) {
                const { data: property } = await supabase
                    .from('properties')
                    .select('photos')
                    .eq('property_id', propertyId)
                    .single();

                const updatedPhotos = property.photos.map(photo =>
                    photo === url ? newUrl : photo
                );

                const { error: updateError } = await supabase
                    .from('properties')
                    .update({ photos: updatedPhotos })
                    .eq('property_id', propertyId);

                if (updateError) {
                    console.error(`Error updating property ${propertyId}:`, updateError);
                } else {
                    console.log(`Updated property ${propertyId} with new photo URL`);
                }
            }
        }

        console.log('Migration completed successfully!');
    } catch (error) {
        console.error('Migration failed:', error);
    }
}

migratePhotos(); 