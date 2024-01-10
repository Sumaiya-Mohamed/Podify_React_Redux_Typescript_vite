import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://uqwsfxdnvkgkiwnawuxd.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVxd3NmeGRudmtna2l3bmF3dXhkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDQ4Mjg5NjgsImV4cCI6MjAyMDQwNDk2OH0.yX-i_reyoAKuxM_BPVDXYQGPXYLSAoUaQLeE7qxPu_0'
export const supabase = createClient(supabaseUrl, supabaseKey)