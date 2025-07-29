// src/lib/supabaseAdmin.ts
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.PRIVATE_SUPABASE_URL!
const supabaseServiceRoleKey = process.env.PRIVATE_SUPABASE_SERVICE_ROLE_KEY!

export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey)
