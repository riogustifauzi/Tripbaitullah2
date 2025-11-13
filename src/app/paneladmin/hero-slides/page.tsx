'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import AdminLayout from '@/components/admin/AdminLayout'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Plus, Edit, Trash2, GripVertical } from 'lucide-react'
import { HeroSlide } from '@/types/hero-slide'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

// Sortable Slide Item Component
function SortableSlideItem({ 
  slide, 
  onEdit, 
  onDelete, 
  isOnlySlide 
}: { 
  slide: HeroSlide
  onEdit: (id: string) => void
  onDelete: (id: string) => void
  isOnlySlide: boolean
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: slide.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow"
    >
      <div className="flex items-center space-x-4">
        {/* Drag Handle */}
        <div 
          {...attributes} 
          {...listeners}
          className="cursor-move text-gray-400 hover:text-gray-600 touch-none"
        >
          <GripVertical className="w-5 h-5" />
        </div>

        {/* Order Number */}
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-semibold">
          {slide.order}
        </div>

        {/* Image Preview */}
        <div className="flex-shrink-0 w-32 h-20 rounded-lg overflow-hidden bg-gray-100">
          <Image
            src={slide.image}
            alt={slide.title}
            width={128}
            height={80}
            className="object-cover w-full h-full"
          />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 truncate">{slide.title}</h3>
          {slide.subtitle && (
            <p className="text-sm text-gray-600 truncate">{slide.subtitle}</p>
          )}
          {slide.ctaText && (
            <p className="text-xs text-emerald-600 mt-1">
              CTA: {slide.ctaText}
            </p>
          )}
        </div>

        {/* Status */}
        <div className="flex-shrink-0">
          <Badge className={slide.isActive ? 'bg-green-500' : 'bg-gray-500'}>
            {slide.isActive ? 'Active' : 'Inactive'}
          </Badge>
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onEdit(slide.id)}
          >
            <Edit className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onDelete(slide.id)}
            className="text-red-600 hover:text-red-700"
            disabled={isOnlySlide}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}

export default function HeroSlidesPage() {
  const router = useRouter()
  const [slides, setSlides] = useState<HeroSlide[]>([])
  const [loading, setLoading] = useState(true)

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  useEffect(() => {
    fetchSlides()
  }, [])

  const fetchSlides = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/hero-slides')
      const data = await response.json()
      setSlides(data.data)
    } catch (error) {
      console.error('Error fetching slides:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (slides.length <= 1) {
      alert('Tidak dapat menghapus slide terakhir. Minimal 1 slide harus ada.')
      return
    }

    if (!confirm('Apakah Anda yakin ingin menghapus slide ini?')) {
      return
    }

    try {
      const response = await fetch(`/api/hero-slides/${id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        fetchSlides()
      } else {
        const error = await response.json()
        alert(error.error.message)
      }
    } catch (error) {
      console.error('Error deleting slide:', error)
      alert('Gagal menghapus slide')
    }
  }

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event

    if (!over || active.id === over.id) {
      return
    }

    const oldIndex = slides.findIndex((slide) => slide.id === active.id)
    const newIndex = slides.findIndex((slide) => slide.id === over.id)

    const reorderedSlides = arrayMove(slides, oldIndex, newIndex)
    
    // Update order numbers
    const updatedSlides = reorderedSlides.map((slide, index) => ({
      ...slide,
      order: index + 1
    }))

    // Optimistic update
    setSlides(updatedSlides)

    // Send to API
    try {
      const response = await fetch('/api/hero-slides/reorder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          slides: updatedSlides.map((slide, index) => ({
            id: slide.id,
            order: index + 1
          }))
        })
      })

      if (!response.ok) {
        throw new Error('Failed to reorder')
      }
    } catch (error) {
      console.error('Error reordering slides:', error)
      fetchSlides() // Revert on error
    }
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Hero Slides</h1>
            <p className="text-gray-600 mt-1">Kelola slider gambar di halaman utama</p>
          </div>
          <Link href="/paneladmin/hero-slides/new">
            <Button className="bg-gradient-to-r from-emerald-600 to-green-600">
              <Plus className="w-4 h-4 mr-2" />
              Tambah Slide
            </Button>
          </Link>
        </div>

        {/* Info */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-800">
            💡 Drag & drop untuk mengubah urutan slide. Minimal 1 slide harus aktif.
          </p>
        </div>

        {/* Slides List */}
        {loading ? (
          <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
            <p className="text-gray-500">Loading...</p>
          </div>
        ) : slides.length === 0 ? (
          <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
            <p className="text-gray-500">Belum ada hero slide</p>
          </div>
        ) : (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={slides.map(slide => slide.id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-4">
                {slides.map((slide) => (
                  <SortableSlideItem
                    key={slide.id}
                    slide={slide}
                    onEdit={(id) => router.push(`/paneladmin/hero-slides/${id}/edit`)}
                    onDelete={handleDelete}
                    isOnlySlide={slides.length <= 1}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        )}
      </div>
    </AdminLayout>
  )
}
