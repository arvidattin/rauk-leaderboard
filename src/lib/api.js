import { supabase } from './supabase';

/**
 * Fetch all participations with user profiles.
 * Useful for the main leaderboard.
 */
export async function getLeaderboard() {
    const { data, error } = await supabase
        .from('participations')
        .select(`
      *,
      profiles (
        username
      )
    `)
        .order('finish_time', { ascending: true });

    if (error) {
        console.error('Error fetching leaderboard:', error);
        return [];
    }
    return data;
}

/**
 * Add a new participation record.
 * @param {Object} participation
 * @param {string} participation.sport
 * @param {number} participation.year
 * @param {string} participation.finish_time - Format "HH:MM:SS"
 * @param {string} [participation.race_name]
 */
export async function addParticipation({ sport, year, finish_time, race_name }) {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) throw new Error('User not logged in');

    const insertData = {
        user_id: user.id,
        sport,
        year,
        finish_time,
        race_name,
    };

    const { data, error } = await supabase
        .from('participations')
        .insert([insertData])
        .select();

    // Handle missing profile error (Foreign Key Violation)
    if (error && error.code === '23503') {
        console.warn('Profile missing for user, creating one now...');
        // Create the profile using the email prefix as username
        const username = user.email ? user.email.split('@')[0] : 'user_' + user.id.slice(0, 8);

        const { error: profileError } = await supabase
            .from('profiles')
            .upsert({ id: user.id, username, updated_at: new Date() });

        if (profileError) throw profileError;

        // Retry the insertion
        const { data: retryData, error: retryError } = await supabase
            .from('participations')
            .insert([insertData])
            .select();

        if (retryError) throw retryError;
        return retryData;
    }

    if (error) throw error;
    return data;
}

/**
 * Get user profile by ID.
 * @param {string} userId 
 */
export async function getProfile(userId) {
    const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

    if (error) {
        console.error('Error fetching profile:', error);
        return null;
    }
    return data;
}

/**
 * Update user profile
 * @param {string} username 
 */
export async function updateProfile({ username }) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not logged in');

    const { data, error } = await supabase
        .from('profiles')
        .upsert({ id: user.id, username, updated_at: new Date() })
        .select();

    if (error) throw error;
    return data;
}

/**
 * Get all participations for a specific user
 * @param {string} userId 
 */
export async function getUserParticipations(userId) {
    const { data, error } = await supabase
        .from('participations')
        .select('*')
        .eq('user_id', userId)
        .order('year', { ascending: false })
        .order('finish_time', { ascending: true });

    if (error) {
        console.error('Error fetching user participations:', error);
        return [];
    }
    return data;
}
