import { useState } from 'react'
import { cn } from '../../lib/cn'

export interface AvatarProps {
  src: string | null | undefined
  alt: string
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const SIZE_CLASS = {
  sm: 'h-8 w-8 text-xs',
  md: 'h-10 w-10 text-sm',
  lg: 'h-12 w-12 text-base',
} as const

function getInitials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0]?.toUpperCase() ?? '')
    .join('')
}

export function Avatar({ src, alt, size = 'md', className }: AvatarProps) {
  const [errored, setErrored] = useState(false)
  const showImage = Boolean(src) && !errored

  return (
    <span
      className={cn(
        'inline-flex shrink-0 items-center justify-center rounded-full bg-neutral-200 text-foreground-muted overflow-hidden',
        SIZE_CLASS[size],
        className,
      )}
      aria-label={alt}
    >
      {showImage ? (
        <img
          src={src as string}
          alt={alt}
          className="h-full w-full object-cover"
          onError={() => setErrored(true)}
        />
      ) : (
        <span aria-hidden>{getInitials(alt)}</span>
      )}
    </span>
  )
}
