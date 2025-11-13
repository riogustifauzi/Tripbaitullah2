import { Label } from '@/components/ui/label'
import FormError from './FormError'

interface FormFieldProps {
  label: string
  htmlFor: string
  required?: boolean
  error?: string | string[]
  helperText?: string
  children: React.ReactNode
  className?: string
}

export default function FormField({
  label,
  htmlFor,
  required = false,
  error,
  helperText,
  children,
  className = ''
}: FormFieldProps) {
  return (
    <div className={`space-y-2 ${className}`}>
      <Label htmlFor={htmlFor} className="flex items-center space-x-1">
        <span>{label}</span>
        {required && <span className="text-red-500">*</span>}
      </Label>
      
      {children}
      
      {helperText && !error && (
        <p className="text-sm text-gray-500">{helperText}</p>
      )}
      
      <FormError error={error} />
    </div>
  )
}
