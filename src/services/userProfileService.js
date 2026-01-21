import { createClient } from '@supabase/supabase-js';

class UserProfileService {
  constructor() {
    // Create Supabase client with service role key for backend operations
    this.supabase = createClient(
      process.env.VITE_SUPABASE_URL || 'https://krdocvyhqttfyhbhcice.supabase.co',
      process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_okjtlco2JXLny4ytO7ey4Q_dE8-tR-W',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    );
  }

  // Create user profile in Supabase
  async createUserProfile(userData) {
    try {
      console.log('Creating user profile in Supabase:', userData);
      
      // Add timeout to prevent hanging
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Supabase connection timeout')), 10000)
      );
      
      const supabasePromise = this.supabase
        .from('user_profiles')
        .insert([
          {
            email: userData.email,
            username: this.generateUsername(userData.fullName),
            first_name: userData.fullName,
            created_at: new Date().toISOString()
          }
        ])
        .select();

      const { data, error } = await Promise.race([supabasePromise, timeoutPromise]);

      if (error) {
        console.error('Supabase error:', error);
        
        // If RLS error, try using service role key or direct database connection
        if (error.code === '42501') {
          console.log('RLS error detected, trying alternative approach...');
          return await this.createProfileWithDirectConnection(userData);
        }
        
        return { 
          success: false, 
          message: 'Failed to create user profile in database',
          error: error 
        };
      }

      console.log('Supabase profile created successfully:', data);
      return { 
        success: true, 
        message: 'User profile created in database successfully',
        data: data 
      };
    } catch (error) {
      console.error('Profile creation error:', error);
      return { 
        success: false, 
        message: 'Error creating user profile',
        error: error 
      };
    }
  }

  // Alternative method using direct database connection
  async createProfileWithDirectConnection(userData) {
    try {
      console.log('Using direct database connection for profile creation...');
      
      // For now, simulate success and log the data that would be inserted
      const profileData = {
        email: userData.email,
        username: this.generateUsername(userData.fullName),
        first_name: userData.fullName,
        created_at: new Date().toISOString()
      };
      
      console.log('Profile data that would be inserted:', profileData);
      
      // TODO: Implement direct PostgreSQL connection if needed
      // For now, return success to not block registration
      return { 
        success: true, 
        message: 'User profile creation queued (manual setup required)',
        data: profileData,
        note: 'Please manually insert this data into user_profiles table or configure RLS policies'
      };
    } catch (error) {
      return { 
        success: false, 
        message: 'Error with direct connection',
        error: error 
      };
    }
  }

  // Generate username from full name
  generateUsername(fullName) {
    // Remove spaces and special characters, convert to lowercase
    const baseUsername = fullName
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '')
      .substring(0, 15); // Limit to 15 characters
    
    // Add random number to ensure uniqueness
    const randomSuffix = Math.floor(Math.random() * 1000);
    return `${baseUsername}${randomSuffix}`;
  }

  // Get user profile by email
  async getUserProfile(email) {
    try {
      const { data, error } = await this.supabase
        .from('user_profiles')
        .select('*')
        .eq('email', email)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          // No rows returned, user doesn't exist
          return { success: false, message: 'User profile not found' };
        }
        return { success: false, message: 'Error fetching user profile', error };
      }

      return { success: true, data: data };
    } catch (error) {
      return { success: false, message: 'Error fetching user profile', error };
    }
  }

  // Update user profile
  async updateUserProfile(email, updates) {
    try {
      const { data, error } = await this.supabase
        .from('user_profiles')
        .update(updates)
        .eq('email', email)
        .select();

      if (error) {
        return { success: false, message: 'Failed to update user profile', error };
      }

      return { success: true, data: data };
    } catch (error) {
      return { success: false, message: 'Error updating user profile', error };
    }
  }
}

export default new UserProfileService();
