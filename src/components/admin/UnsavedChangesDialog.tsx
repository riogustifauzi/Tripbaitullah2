import { AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface UnsavedChangesDialogProps {
  isOpen: boolean
  onConfirm: () => void
  onCancel: () => void
}

export default function UnsavedChangesDialog({
  isOpen,
  onConfirm,
  onCancel
}: UnsavedChangesDialogProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50"
        onClick={onCancel}
      />
      
      {/* Dialog */}
      <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-6">
        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0">
            <div className="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
          
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Perubahan Belum Disimpan
            </h3>
            <p className="text-sm text-gray-600 mb-6">
              Anda memiliki perubahan yang belum disimpan. Apakah Anda yakin ingin meninggalkan halaman ini? Semua perubahan akan hilang.
            </p>
            
            <div className="flex items-center justify-end space-x-3">
              <Button
                variant="outline"
                onClick={onCancel}
              >
                Tetap di Halaman
              </Button>
              <Button
                onClick={onConfirm}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                Tinggalkan Halaman
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
