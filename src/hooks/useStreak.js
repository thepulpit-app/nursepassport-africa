import { useEffect } from 'react'
import { supabase } from '../lib/supabase'

export function useStreak(user) {
  useEffect(() => {
    if (!user) return
    updateStreak(user.id)
  }, [user])
}

async function updateStreak(userId) {
  try {
    const { data: profile } = await supabase
      .from('profiles')
      .select('current_streak, longest_streak, last_active_date')
      .eq('id', userId)
      .single()

    if (!profile) return

    const today = new Date().toISOString().split('T')[0]
    const lastActive = profile.last_active_date

    // Already logged today — no update needed
    if (lastActive === today) return

    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)
    const yesterdayStr = yesterday.toISOString().split('T')[0]

    let newStreak = 1
    if (lastActive === yesterdayStr) {
      // Consecutive day — increment streak
      newStreak = (profile.current_streak || 0) + 1
    }
    // If last active was before yesterday — streak resets to 1

    const newLongest = Math.max(newStreak, profile.longest_streak || 0)

    await supabase.from('profiles').update({
      current_streak: newStreak,
      longest_streak: newLongest,
      last_active_date: today,
    }).eq('id', userId)
  } catch (err) {
    console.error('Streak update failed:', err)
  }
}
