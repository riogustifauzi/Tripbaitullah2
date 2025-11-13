'use client'

import { useState, useRef } from 'react'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { 
  Bold, Italic, Underline, Strikethrough, 
  Heading1, Heading2, Heading3,
  List, ListOrdered, Quote, Code, Link, Image, 
  Smile, AlignLeft, AlignCenter, AlignRight,
  Eye, EyeOff
} from 'lucide-react'

interface RichTextEditorProps {
  value: string
  onChange: (value: string) => void
  label?: string
  error?: string
  placeholder?: string
}

export default function RichTextEditor({
  value,
  onChange,
  label,
  error,
  placeholder = 'Tulis konten artikel...'
}: RichTextEditorProps) {
  const [showPreview, setShowPreview] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Insert text at cursor position
  const insertText = (before: string, after: string = '', placeholder: string = '') => {
    const textarea = textareaRef.current
    if (!textarea) return

    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selectedText = value.substring(start, end)
    const textToInsert = selectedText || placeholder

    const newText = 
      value.substring(0, start) + 
      before + textToInsert + after + 
      value.substring(end)

    onChange(newText)

    // Set cursor position
    setTimeout(() => {
      textarea.focus()
      const newCursorPos = start + before.length + textToInsert.length
      textarea.setSelectionRange(newCursorPos, newCursorPos)
    }, 0)
  }

  // Toolbar actions
  const formatBold = () => insertText('<strong>', '</strong>', 'teks tebal')
  const formatItalic = () => insertText('<em>', '</em>', 'teks miring')
  const formatUnderline = () => insertText('<u>', '</u>', 'teks garis bawah')
  const formatStrikethrough = () => insertText('<s>', '</s>', 'teks coret')
  
  const formatH1 = () => insertText('<h1>', '</h1>', 'Heading 1')
  const formatH2 = () => insertText('<h2>', '</h2>', 'Heading 2')
  const formatH3 = () => insertText('<h3>', '</h3>', 'Heading 3')
  
  const formatList = () => insertText('<ul>\n  <li>', '</li>\n</ul>', 'Item list')
  const formatOrderedList = () => insertText('<ol>\n  <li>', '</li>\n</ol>', 'Item list')
  const formatQuote = () => insertText('<blockquote>', '</blockquote>', 'Kutipan')
  const formatCode = () => insertText('<code>', '</code>', 'kode')
  
  const insertParagraph = () => insertText('<p>', '</p>', 'Paragraf baru')
  const insertLineBreak = () => insertText('<br>', '')
  
  const autoFormatText = () => {
    console.log('Auto-formatting text...')
    console.log('Original:', value)
    const formatted = convertNewlinesToHTML(value)
    console.log('Formatted:', formatted)
    
    if (formatted === value) {
      alert('Text sudah dalam format HTML atau tidak ada perubahan yang diperlukan.')
    } else {
      onChange(formatted)
      alert('Text berhasil diformat! Klik Preview untuk melihat hasilnya.')
    }
  }
  
  const insertLink = () => {
    const url = prompt('Masukkan URL:')
    if (url) {
      insertText(`<a href="${url}" target="_blank" rel="noopener noreferrer">`, '</a>', 'teks link')
    }
  }
  
  const insertImage = () => {
    const url = prompt('Masukkan URL gambar:')
    if (url) {
      const alt = prompt('Masukkan deskripsi gambar (alt text):') || 'image'
      insertText(`<img src="${url}" alt="${alt}" class="w-full rounded-lg my-4" />`, '')
    }
  }

  const insertEmoji = () => {
    const emojis = ['😊', '👍', '❤️', '🙏', '✨', '🌟', '💫', '🕌', '🤲', '📿', '☪️', '🌙']
    const emoji = prompt(`Pilih emoji (salin dan paste):\n${emojis.join(' ')}`)
    if (emoji) {
      insertText(emoji, '')
    }
  }

  const formatColor = () => {
    const color = prompt('Masukkan warna (contoh: #10b981 atau emerald-600):')
    if (color) {
      const colorClass = color.startsWith('#') 
        ? `style="color: ${color}"` 
        : `class="text-${color}"`
      insertText(`<span ${colorClass}>`, '</span>', 'teks berwarna')
    }
  }

  // Convert newlines to HTML
  const convertNewlinesToHTML = (text: string) => {
    if (!text || text.trim() === '') return text
    
    // If text already has substantial HTML tags, preserve them
    const hasHTMLTags = /<(p|div|h[1-6]|ul|ol|li|blockquote)[\s>]/.test(text)
    if (hasHTMLTags) {
      return text
    }
    
    // Convert double newlines to paragraphs
    const paragraphs = text.split(/\n\n+/)
    return paragraphs
      .filter(para => para.trim() !== '') // Remove empty paragraphs
      .map(para => {
        const trimmed = para.trim()
        // Convert single newlines within paragraph to <br>
        const withBreaks = trimmed.split('\n').join('<br>\n')
        return `<p>${withBreaks}</p>`
      })
      .join('\n\n')
  }

  // Render HTML preview
  const renderPreview = () => {
    const htmlContent = convertNewlinesToHTML(value)
    return { __html: htmlContent }
  }

  return (
    <div className="space-y-2">
      {label && <Label>{label}</Label>}
      
      <div className="border border-gray-300 rounded-lg overflow-hidden bg-white">
        {/* Toolbar */}
        <div className="bg-gray-50 border-b border-gray-300 p-2">
          <div className="flex flex-wrap items-center gap-1">
            {/* Text Formatting */}
            <div className="flex items-center gap-1 border-r border-gray-300 pr-2">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={formatBold}
                className="h-8 w-8 p-0"
                title="Bold (Ctrl+B)"
              >
                <Bold className="w-4 h-4" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={formatItalic}
                className="h-8 w-8 p-0"
                title="Italic (Ctrl+I)"
              >
                <Italic className="w-4 h-4" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={formatUnderline}
                className="h-8 w-8 p-0"
                title="Underline (Ctrl+U)"
              >
                <Underline className="w-4 h-4" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={formatStrikethrough}
                className="h-8 w-8 p-0"
                title="Strikethrough"
              >
                <Strikethrough className="w-4 h-4" />
              </Button>
            </div>

            {/* Headings */}
            <div className="flex items-center gap-1 border-r border-gray-300 pr-2">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={formatH1}
                className="h-8 w-8 p-0"
                title="Heading 1"
              >
                <Heading1 className="w-4 h-4" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={formatH2}
                className="h-8 w-8 p-0"
                title="Heading 2"
              >
                <Heading2 className="w-4 h-4" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={formatH3}
                className="h-8 w-8 p-0"
                title="Heading 3"
              >
                <Heading3 className="w-4 h-4" />
              </Button>
            </div>

            {/* Lists & Quote */}
            <div className="flex items-center gap-1 border-r border-gray-300 pr-2">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={formatList}
                className="h-8 w-8 p-0"
                title="Bullet List"
              >
                <List className="w-4 h-4" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={formatOrderedList}
                className="h-8 w-8 p-0"
                title="Numbered List"
              >
                <ListOrdered className="w-4 h-4" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={formatQuote}
                className="h-8 w-8 p-0"
                title="Quote"
              >
                <Quote className="w-4 h-4" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={formatCode}
                className="h-8 w-8 p-0"
                title="Code"
              >
                <Code className="w-4 h-4" />
              </Button>
            </div>

            {/* Paragraph & Line Break */}
            <div className="flex items-center gap-1 border-r border-gray-300 pr-2">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={insertParagraph}
                className="h-8 px-2 text-xs"
                title="New Paragraph"
              >
                ¶
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={insertLineBreak}
                className="h-8 px-2 text-xs"
                title="Line Break"
              >
                ↵
              </Button>
            </div>

            {/* Insert */}
            <div className="flex items-center gap-1 border-r border-gray-300 pr-2">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={insertLink}
                className="h-8 w-8 p-0"
                title="Insert Link"
              >
                <Link className="w-4 h-4" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={insertImage}
                className="h-8 w-8 p-0"
                title="Insert Image"
              >
                <Image className="w-4 h-4" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={insertEmoji}
                className="h-8 w-8 p-0"
                title="Insert Emoji"
              >
                <Smile className="w-4 h-4" />
              </Button>
            </div>

            {/* Color */}
            <div className="flex items-center gap-1 border-r border-gray-300 pr-2">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={formatColor}
                className="h-8 px-2 text-xs"
                title="Text Color"
              >
                <span className="text-emerald-600">A</span>
              </Button>
            </div>

            {/* Auto Format & Preview Toggle */}
            <div className="flex items-center gap-1 ml-auto">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={autoFormatText}
                className="h-8 px-3 text-xs"
                title="Auto-format paragraf dari plain text"
              >
                🔄 Format
              </Button>
              <Button
                type="button"
                variant={showPreview ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setShowPreview(!showPreview)}
                className="h-8 px-3 text-xs"
              >
                {showPreview ? (
                  <>
                    <EyeOff className="w-4 h-4 mr-1" />
                    Edit
                  </>
                ) : (
                  <>
                    <Eye className="w-4 h-4 mr-1" />
                    Preview
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Editor / Preview */}
        {showPreview ? (
          <div 
            className="p-4 min-h-[400px] prose prose-lg max-w-none overflow-auto"
            dangerouslySetInnerHTML={renderPreview()}
          />
        ) : (
          <Textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            rows={15}
            className="border-0 focus:ring-0 resize-none font-mono text-sm"
          />
        )}
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}
      
      <div className="flex items-start justify-between text-xs text-gray-500">
        <div className="space-y-1">
          <p>💡 Tips: Gunakan toolbar di atas untuk formatting text</p>
          <p>📝 Tulis plain text lalu klik "🔄 Format" untuk auto-convert ke paragraf</p>
          <p>⌨️ Atau tulis HTML langsung untuk kontrol penuh</p>
        </div>
        <p className="text-right">{value.length} karakter</p>
      </div>
    </div>
  )
}
