// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://kpumzfpdzetgoylkzdmb.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtwdW16ZnBkemV0Z295bGt6ZG1iIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk2MjQ2MTIsImV4cCI6MjA2NTIwMDYxMn0.WS3AE2DUsKqrMvX-_xaOP8itjVqvbz0y4bNj1HlkdZM";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);