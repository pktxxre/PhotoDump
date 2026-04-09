import { useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { supabase } from '../lib/supabase'

const PUBLIC_ROUTES = ['/login', '/signup']

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate()
  const location = useLocation()
  const [checked, setChecked] = useState(false)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      const authed = !!data.session
      const onPublic = PUBLIC_ROUTES.includes(location.pathname)
      if (!authed && !onPublic) navigate('/login', { replace: true })
      if (authed && onPublic) navigate('/', { replace: true })
      setChecked(true)
    })

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      const onPublic = PUBLIC_ROUTES.includes(location.pathname)
      if (!session && !onPublic) navigate('/login', { replace: true })
      if (session && onPublic) navigate('/', { replace: true })
    })

    return () => listener.subscription.unsubscribe()
  }, [])

  if (!checked) return null
  return <>{children}</>
}
