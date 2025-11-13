/**
 * Accessibility utility functions
 */

// Generate unique ID for form fields
export function generateId(prefix: string): string {
  return `${prefix}-${Math.random().toString(36).substr(2, 9)}`
}

// Get ARIA label for action buttons
export function getActionAriaLabel(action: string, itemName: string): string {
  const labels: Record<string, string> = {
    edit: `Edit ${itemName}`,
    delete: `Delete ${itemName}`,
    view: `View ${itemName}`,
    add: `Add new ${itemName}`,
    save: `Save ${itemName}`,
    cancel: `Cancel editing ${itemName}`,
    search: `Search ${itemName}`,
    filter: `Filter ${itemName}`,
    sort: `Sort ${itemName}`,
    upload: `Upload ${itemName}`
  }
  
  return labels[action] || action
}

// Get ARIA live region announcement
export function getAriaLiveAnnouncement(
  action: 'success' | 'error' | 'info' | 'warning',
  message: string
): string {
  const prefixes: Record<string, string> = {
    success: 'Success:',
    error: 'Error:',
    info: 'Information:',
    warning: 'Warning:'
  }
  
  return `${prefixes[action]} ${message}`
}

// Check if element is focusable
export function isFocusable(element: HTMLElement): boolean {
  const focusableTags = ['A', 'BUTTON', 'INPUT', 'SELECT', 'TEXTAREA']
  return (
    focusableTags.includes(element.tagName) ||
    element.hasAttribute('tabindex') ||
    element.hasAttribute('contenteditable')
  )
}

// Trap focus within a container (for modals/dialogs)
export function trapFocus(container: HTMLElement, event: KeyboardEvent) {
  if (event.key !== 'Tab') return

  const focusableElements = container.querySelectorAll<HTMLElement>(
    'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
  )

  const firstElement = focusableElements[0]
  const lastElement = focusableElements[focusableElements.length - 1]

  if (event.shiftKey) {
    if (document.activeElement === firstElement) {
      lastElement.focus()
      event.preventDefault()
    }
  } else {
    if (document.activeElement === lastElement) {
      firstElement.focus()
      event.preventDefault()
    }
  }
}

// Announce to screen readers
export function announceToScreenReader(message: string, priority: 'polite' | 'assertive' = 'polite') {
  const announcement = document.createElement('div')
  announcement.setAttribute('role', 'status')
  announcement.setAttribute('aria-live', priority)
  announcement.setAttribute('aria-atomic', 'true')
  announcement.className = 'sr-only'
  announcement.textContent = message

  document.body.appendChild(announcement)

  setTimeout(() => {
    document.body.removeChild(announcement)
  }, 1000)
}

// Get keyboard shortcut description
export function getKeyboardShortcut(key: string, modifiers: string[] = []): string {
  const isMac = typeof navigator !== 'undefined' && /Mac/.test(navigator.platform)
  const modifierMap: Record<string, string> = {
    ctrl: isMac ? '⌘' : 'Ctrl',
    alt: isMac ? '⌥' : 'Alt',
    shift: isMac ? '⇧' : 'Shift'
  }

  const modifierKeys = modifiers.map(m => modifierMap[m] || m).join('+')
  return modifierKeys ? `${modifierKeys}+${key}` : key
}
