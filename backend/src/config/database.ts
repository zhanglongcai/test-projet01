import { createClient } from '@supabase/supabase-js';
import { logger } from '../utils/logger.js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Supabase credentials are not defined in environment variables');
  process.exit(1);
}

export const supabase = createClient(supabaseUrl, supabaseKey);

export async function initializeDatabase() {
  try {
    const { data, error } = await supabase.from('t_user').select('count(*)');
    
    if (error) {
      console.error('Database connection failed:', error);
      throw error;
    }
    
    console.info('Database connected successfully');
    return true;
  } catch (error) {
    console.error('Database initialization failed:', error);
    throw error;
  }
}