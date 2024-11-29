import { supabase } from './client.js';
import { logger } from '../../utils/logger.js';

export async function initializeDatabase() {
  try {
    // Test connection by fetching a single row from t_user
    const { data, error } = await supabase
      .from('t_user')
      .select('f_id')
      .limit(1);
    
    if (error) {
      logger.error('Database connection failed:', error);
      throw error;
    }
    
    logger.info('Database connected successfully');
    return true;
  } catch (error) {
    logger.error('Database initialization failed:', error);
    throw error;
  }
}