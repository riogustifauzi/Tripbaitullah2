'use client'

import { useState, useEffect } from 'react'
import { Search, Filter, X } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

export interface FilterOption {
  key: string
  label: string
  options: Array<{ value: string; label: string }>
}

interface SearchFilterProps {
  searchPlaceholder?: string
  onSearchChange: (value: string) => void
  filters?: FilterOption[]
  onFilterChange?: (key: string, value: string) => void
  onClearFilters?: () => void
}

export default function SearchFilter({
  searchPlaceholder = 'Cari...',
  onSearchChange,
  filters = [],
  onFilterChange,
  onClearFilters
}: SearchFilterProps) {
  const [searchValue, setSearchValue] = useState('')
  const [filterValues, setFilterValues] = useState<Record<string, string>>({})
  const [showFilters, setShowFilters] = useState(false)

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      onSearchChange(searchValue)
    }, 300)

    return () => clearTimeout(timer)
  }, [searchValue, onSearchChange])

  const handleFilterChange = (key: string, value: string) => {
    const newValues = { ...filterValues, [key]: value }
    setFilterValues(newValues)
    onFilterChange?.(key, value)
  }

  const handleClearFilters = () => {
    setSearchValue('')
    setFilterValues({})
    onClearFilters?.()
  }

  const hasActiveFilters = searchValue || Object.values(filterValues).some(v => v)

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 space-y-4">
      {/* Search and Filter Toggle */}
      <div className="flex flex-col md:flex-row gap-3">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            type="text"
            placeholder={searchPlaceholder}
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Filter Button */}
        {filters.length > 0 && (
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center space-x-2"
          >
            <Filter className="w-4 h-4" />
            <span>Filter</span>
            {Object.values(filterValues).filter(v => v).length > 0 && (
              <span className="ml-1 px-2 py-0.5 bg-emerald-100 text-emerald-700 text-xs rounded-full">
                {Object.values(filterValues).filter(v => v).length}
              </span>
            )}
          </Button>
        )}

        {/* Clear Filters */}
        {hasActiveFilters && (
          <Button
            variant="ghost"
            onClick={handleClearFilters}
            className="flex items-center space-x-2 text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <X className="w-4 h-4" />
            <span>Clear</span>
          </Button>
        )}
      </div>

      {/* Filter Options */}
      {showFilters && filters.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-4 border-t border-gray-200">
          {filters.map((filter) => (
            <div key={filter.key}>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {filter.label}
              </label>
              <select
                value={filterValues[filter.key] || ''}
                onChange={(e) => handleFilterChange(filter.key, e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="">Semua</option>
                {filter.options.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
