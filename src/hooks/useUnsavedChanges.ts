import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

/**
 * Hook to detect unsaved changes and prompt user before leaving
 */
export function useUnsavedChanges(hasUnsavedChanges: boolean) {
  const router = useRouter()
  const [showConfirm, setShowConfirm] = useState(false)
  const [pendingNavigation, setPendingNavigation] = useState<string | null>(null)

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault()
        e.returnValue = ''
      }
    }

    window.addEventListener('beforeunload', handleBeforeUnload)

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
    }
  }, [hasUnsavedChanges])

  const confirmNavigation = () => {
    if (pendingNavigation) {
      router.push(pendingNavigation)
    }
    setShowConfirm(false)
    setPendingNavigation(null)
  }

  const cancelNavigation = () => {
    setShowConfirm(false)
    setPendingNavigation(null)
  }

  const handleCancel = (destination: string) => {
    if (hasUnsavedChanges) {
      setPendingNavigation(destination)
      setShowConfirm(true)
    } else {
      router.push(destination)
    }
  }

  return {
    showConfirm,
    confirmNavigation,
    cancelNavigation,
    handleCancel
  }
}
