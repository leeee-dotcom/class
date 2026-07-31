import { STUDENTS } from './students'
import type { Student } from './types'

/*
 * 화면이 데이터 출처를 알지 못하게 하는 유일한 경계.
 * 지금은 로컬 가상 데이터를 돌려주지만 반환을 Promise로 감싸 두었기 때문에,
 * 나중에 Supabase(src/lib/supabase.ts)로 바꿀 때 이 파일 내부만 고치면 된다.
 * 화면 컴포넌트가 students.ts 를 직접 import 하면 그 경계가 깨진다.
 */

export async function listStudents(): Promise<Student[]> {
  return [...STUDENTS].sort((a, b) => a.number - b.number)
}

export async function getStudent(id: string): Promise<Student | null> {
  return STUDENTS.find((student) => student.id === id) ?? null
}
