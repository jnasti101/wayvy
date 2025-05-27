import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client with correct URL and key
const supabaseUrl = 'https://kynwqwvmbvthbekukfaq.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt5bndxd3ZtYnZ0aGJla3VrZmFxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc3MDY1ODcsImV4cCI6MjA2MzI4MjU4N30.cs0zjx6PWZni7BDo67iyE0U6mwp2pg3u5f2E7O-LJxI';

// Create the client with proper configuration for browser environments
export const supabase = createClient(supabaseUrl, supabaseKey);
