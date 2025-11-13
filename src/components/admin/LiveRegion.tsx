'use client'

import { useEffect, useState } from 'react'

interface LiveRegionProps {
  message: string
  priority?: 'polite' | 'assertive'
  clearAfter?: number
}

/**
 * Live region component for screen reader announcements
 * Automatically announces messages to screen readers
 */
export default function LiveRegion({ 
  message, 
  priority = 'polite',
  clearAfter = 3000 
}: LiveRegionProps) {
  const [announcement, setAnnouncement] = useState(message)

  useEffect(() => {
    setAnnouncement(message)

    if (clearAfter > 0) {
      const timer = setTimeout(() => {
        setAnnouncement('')
      }, clearAfter)

      return () => clearTimeout(timer)
    }
  }, [message, clearAfter])

  return (
    <div
      role="status"
      aria-live={priority}
      aria-atomic="true"
      className="sr-only"
    >
      {announcement}
    </div>
  )
}

/**
 * Hook to manage live region announcements
 */
export function useLiveRegion() {
  const [message, setMessage] = useState('')
  const [priority, setPriority] = useState<'polite' | 'assertive'>('polite')

  const announce = (text: string, announcePriority: 'polite' | 'assertive' = 'polite') => {
    setMessage(text)
    setPriority(announcePriority)
  }

  const clear = () => {
    setMessage('')
  }

  return {
    message,
    priority,
    announce,
    clear
  }
}
