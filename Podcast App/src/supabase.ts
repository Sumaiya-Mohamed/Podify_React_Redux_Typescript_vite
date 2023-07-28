import { createClient } from '@supabase/supabase-js'
  import { Auth } from '@supabase/auth-ui-react'
  import { ThemeSupa } from '@supabase/auth-ui-shared'

const SUPABASE_URL= 'https://rjgeumesaxmswiptpfvs.supabase.co'
const SUPABASE_PUBLIC_KEY='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJqZ2V1bWVzYXhtc3dpcHRwZnZzIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTA0OTUyNzcsImV4cCI6MjAwNjA3MTI3N30.5OSQUArvZpPnNocH2uVO6Bfr0KaQe1nOrglre9UvJmM'


//if (!SUPABASE_URL || !SUPABASE_PUBLIC_KEY) {
// throw new Error('Supabase URL or public key is missing.');
//}

export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLIC_KEY);
