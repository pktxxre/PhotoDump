import type { User } from '../types'

interface Props {
  user: User
  size?: number
}

export default function UserAvatar({ user, size = 36 }: Props) {
  return (
    <img
      className="user-avatar"
      src={user.avatar}
      alt={user.name}
      width={size}
      height={size}
      style={{
        width: size,
        height: size,
        borderColor: user.color,
        borderWidth: 2,
      }}
      onError={(e) => {
        const el = e.currentTarget
        el.style.display = 'none'
        const fb = document.createElement('div')
        fb.style.cssText = `width:${size}px;height:${size}px;border-radius:50%;background:${user.color};color:#fff;display:flex;align-items:center;justify-content:center;font-size:${size * 0.36}px;font-weight:700;font-family:sans-serif;flex-shrink:0;`
        fb.textContent = user.initials
        el.parentNode?.insertBefore(fb, el)
      }}
    />
  )
}
