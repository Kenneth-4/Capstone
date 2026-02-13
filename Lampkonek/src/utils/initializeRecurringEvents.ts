import { supabase } from '../lib/supabase';

const DEFAULT_RECURRING_EVENTS = [
    { key: 'sunday_service', title: 'Sunday Service', dayOfWeek: 0, time: '09:00', endTime: '11:00', enabled: true, venue: 'Main Sanctuary' },
    { key: 'prayer_meeting', title: 'Prayer Meeting', dayOfWeek: 1, time: '19:00', endTime: '20:30', enabled: true, venue: 'Prayer Room' },
    { key: 'bible_study', title: 'Bible Study', dayOfWeek: 5, time: '18:00', endTime: '19:30', enabled: true, venue: 'Community Hall' },
];

export const initializeRecurringEvents = async () => {
    try {
        // Check if recurring events already exist
        const { data: existing, error: fetchError } = await supabase
            .from('app_settings')
            .select('value')
            .eq('key', 'recurring_events')
            .single();

        // If they don't exist (no row found), create them
        if (!existing || fetchError) {
            console.log('Initializing default recurring events...');
            const { error: insertError } = await supabase
                .from('app_settings')
                .insert({
                    key: 'recurring_events',
                    value: JSON.stringify(DEFAULT_RECURRING_EVENTS)
                });

            if (insertError) {
                console.error('Error initializing recurring events:', insertError);
                throw insertError;
            } else {
                console.log('Default recurring events initialized successfully');
                console.log('Created events:', DEFAULT_RECURRING_EVENTS);
            }
        } else {
            console.log('Recurring events already exist in database');
            console.log('Existing events:', JSON.parse(existing.value));
        }
    } catch (error) {
        console.error('Error in initializeRecurringEvents:', error);
        throw error;
    }
};
