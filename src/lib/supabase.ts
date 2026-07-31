import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!url || !anonKey) {
  console.warn(
    'Supabase 환경변수가 없습니다. .env.example을 복사해 .env.local을 만들고 값을 채워주세요.',
  )
}

export const supabase = createClient(url ?? '', anonKey ?? '')
