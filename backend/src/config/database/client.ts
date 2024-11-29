import { createClient } from '@supabase/supabase-js';
import { logger } from '../../utils/logger.js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  logger.error('Supabase credentials are not defined in environment variables');
  process.exit(1);
}

export const supabase = createClient(supabaseUrl, supabaseKey);