import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://ubeoiowydnbddusgmptf.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InViZW9pb3d5ZG5iZGR1c2dtcHRmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDg4NjI5NTEsImV4cCI6MjAyNDQzODk1MX0.wSF_WivBOrBSBFhRv-HGrlYXFF-49CfWOkcMUPorVVg'
export const supabase = createClient(supabaseUrl, supabaseKey)
