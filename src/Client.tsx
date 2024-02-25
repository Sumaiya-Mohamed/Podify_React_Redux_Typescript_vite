import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://dqmxvwjzbfflcalqdumj.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRxbXh2d2p6YmZmbGNhbHFkdW1qIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDcyNDIyMzYsImV4cCI6MjAyMjgxODIzNn0.wSmYzMMiEGck3rqHLwsF7Q67TYLHHudNLHwWPTMGYAk'
export const supabase = createClient(supabaseUrl, supabaseKey)
