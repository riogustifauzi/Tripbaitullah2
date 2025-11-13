import { AlertCircle } from 'lucide-react'

interface FormErrorProps {
  error?: string | string[]
  className?: string
}

export default function FormError({ error, className = '' }: FormErrorProps) {
  if (!error) return null

  const errors = Array.isArray(error) ? error : [error]

  return (
    <div className={`space-y-1 ${className}`}>
      {errors.map((err, index) => (
        <div key={index} className="flex items-start space-x-2 text-sm text-red-600">
          <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
          <span>{err}</span>
        </div>
      ))}
    </div>
  )
}
