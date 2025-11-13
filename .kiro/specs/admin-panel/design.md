# Design Document - Panel Admin Tripbaitullah

## Overview

Panel Admin Tripbaitullah adalah aplikasi web berbasis Next.js 14 dengan App Router yang menyediakan antarmuka manajemen untuk administrator. Sistem ini menggunakan React Server Components dan Client Components untuk optimasi performa, dengan state management menggunakan React hooks dan data fetching menggunakan Next.js API routes.

### Technology Stack

- **Frontend Framework**: Next.js 14 (App Router)
- **UI Library**: React 18
- **Styling**: Tailwind CSS
- **Component Library**: shadcn/ui
- **Icons**: Lucide React
- **State Management**: React useState/useReducer
- **Form Handling**: React Hook Form + Zod validation
- **Data Fetching**: Next.js API Routes + SWR for client-side
- **Image Handling**: Next.js Image component
- **Rich Text Editor**: TipTap or React Quill

## Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Browser (Client)                         │
│  ┌────────────────────────────────────────────────────────┐ │
│  │         Admin Panel UI (React Components)              │ │
│  │  - Dashboard  - Travel Mgmt  - Package Mgmt           │ │
│  │  - Content Mgmt  - Hero Slider Mgmt                   │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                            │
                            │ HTTP/REST API
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                  Next.js Server (App Router)                 │
│  ┌────────────────────────────────────────────────────────┐ │
│  │              API Routes (/api/*)                       │ │
│  │  - /api/travels  - /api/packages                      │ │
│  │  - /api/blogs    - /api/hero-slides                   │ │
│  └────────────────────────────────────────────────────────┘ │
│  ┌────────────────────────────────────────────────────────┐ │
│  │              Business Logic Layer                      │ │
│  │  - Validation  - Data Processing  - File Upload       │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                            │
                            │ Data Access
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                    Data Storage Layer                        │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │   JSON Files │  │    Images    │  │   Uploads    │     │
│  │   /data/*.json│  │  /public/*   │  │  /uploads/*  │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
└─────────────────────────────────────────────────────────────┘
```

### Folder Structure

```
src/
├── app/
│   ├── admin/
│   │   ├── page.tsx                    # Dashboard
│   │   ├── travels/
│   │   │   ├── page.tsx                # Travel list
│   │   │   ├── new/page.tsx            # Add travel
│   │   │   └── [id]/
│   │   │       ├── page.tsx            # View travel
│   │   │       └── edit/page.tsx       # Edit travel
│   │   ├── packages/
│   │   │   ├── page.tsx                # Package list
│   │   │   ├── new/page.tsx            # Add package
│   │   │   └── [id]/
│   │   │       ├── page.tsx            # View package
│   │   │       └── edit/page.tsx       # Edit package
│   │   ├── content/
│   │   │   ├── page.tsx                # Content list
│   │   │   ├── new/page.tsx            # Add article
│   │   │   └── [id]/
│   │   │       ├── page.tsx            # View article
│   │   │       └── edit/page.tsx       # Edit article
│   │   └── hero-slides/
│   │       ├── page.tsx                # Hero slides list
│   │       ├── new/page.tsx            # Add slide
│   │       └── [id]/
│   │           └── edit/page.tsx       # Edit slide
│   └── api/
│       ├── travels/
│       │   ├── route.ts                # GET, POST
│       │   └── [id]/route.ts           # GET, PUT, DELETE
│       ├── packages/
│       │   ├── route.ts                # GET, POST
│       │   └── [id]/route.ts           # GET, PUT, DELETE
│       ├── blogs/
│       │   ├── route.ts                # GET, POST
│       │   └── [id]/route.ts           # GET, PUT, DELETE
│       ├── hero-slides/
│       │   ├── route.ts                # GET, POST
│       │   ├── [id]/route.ts           # GET, PUT, DELETE
│       │   └── reorder/route.ts        # POST (reorder slides)
│       └── upload/
│           └── route.ts                # POST (file upload)
├── components/
│   ├── admin/
│   │   ├── AdminLayout.tsx             # Main admin layout
│   │   ├── AdminSidebar.tsx            # Navigation sidebar
│   │   ├── AdminHeader.tsx             # Header with profile
│   │   ├── StatsCard.tsx               # Dashboard stat cards
│   │   ├── DataTable.tsx               # Reusable data table
│   │   ├── Pagination.tsx              # Pagination component
│   │   ├── SearchFilter.tsx            # Search and filter
│   │   ├── ConfirmDialog.tsx           # Delete confirmation
│   │   ├── Notification.tsx            # Toast notifications
│   │   └── forms/
│   │       ├── TravelForm.tsx          # Travel provider form
│   │       ├── PackageForm.tsx         # Package form
│   │       ├── BlogForm.tsx            # Blog article form
│   │       ├── HeroSlideForm.tsx       # Hero slide form
│   │       ├── ImageUpload.tsx         # Image upload component
│   │       └── RichTextEditor.tsx      # Rich text editor
│   └── ui/                             # shadcn/ui components
├── lib/
│   ├── api/
│   │   ├── travels.ts                  # Travel API client
│   │   ├── packages.ts                 # Package API client
│   │   ├── blogs.ts                    # Blog API client
│   │   └── hero-slides.ts              # Hero slides API client
│   ├── validations/
│   │   ├── travel.schema.ts            # Travel validation schema
│   │   ├── package.schema.ts           # Package validation schema
│   │   ├── blog.schema.ts              # Blog validation schema
│   │   └── hero-slide.schema.ts        # Hero slide validation schema
│   ├── utils/
│   │   ├── file-upload.ts              # File upload utilities
│   │   ├── date-formatter.ts           # Date formatting
│   │   └── currency-formatter.ts       # Currency formatting
│   └── data/
│       ├── travels.json                # Travel providers data
│       ├── packages.json               # Packages data
│       ├── blogs.json                  # Blog articles data
│       └── hero-slides.json            # Hero slides data
└── types/
    ├── travel.ts                       # Travel type definitions
    ├── package.ts                      # Package type definitions
    ├── blog.ts                         # Blog type definitions
    └── hero-slide.ts                   # Hero slide type definitions
```

## Components and Interfaces

### 1. Admin Layout Component

**Purpose**: Provides consistent layout structure for all admin pages

**Component Structure**:
```tsx
<AdminLayout>
  <AdminSidebar />
  <div className="main-content">
    <AdminHeader />
    <main>{children}</main>
  </div>
</AdminLayout>
```

**Features**:
- Responsive sidebar (collapsible on mobile)
- Fixed header with profile dropdown
- Main content area with proper spacing
- Active route highlighting

### 2. Dashboard Page

**Purpose**: Display overview statistics and recent activities

**Key Components**:
- `StatsCard`: Display metrics (total travels, packages, blogs, bookings)
- `RecentActivities`: Show recent updates
- `QuickActions`: Buttons for common tasks

**Data Requirements**:
- Aggregate counts from all data sources
- Recent 5 items from each category
- Trend indicators (optional)

### 3. Travel Provider Management

#### List Page (`/admin/travels`)

**Components**:
- `SearchFilter`: Search by name, filter by city/status
- `DataTable`: Display travel providers in table format
- `Pagination`: Navigate through pages
- Action buttons: View, Edit, Delete

**Table Columns**:
- Logo (thumbnail)
- Name
- City
- Total Packages
- Rating
- Status (Active/Inactive)
- Actions

#### Form Pages (`/admin/travels/new`, `/admin/travels/[id]/edit`)

**Form Fields**:
```typescript
interface TravelFormData {
  name: string                    // Required
  logo: File | string             // Required (image upload)
  city: string                    // Required
  address: string                 // Required
  phone: string                   // Required
  email: string                   // Required
  website?: string                // Optional
  description: string             // Required
  certifications: string[]        // Required (multi-select)
  rating: number                  // Required (1-5)
  status: 'active' | 'inactive'   // Required
}
```

**Validation Rules**:
- Name: min 3 chars, max 100 chars
- Email: valid email format
- Phone: valid phone format (Indonesian)
- Logo: max 2MB, formats: jpg, png, webp
- Rating: 1-5 range
- Certifications: at least 1 required

### 4. Package Management

#### List Page (`/admin/packages`)

**Components**:
- `SearchFilter`: Search by title, filter by travel/date/status
- `DataTable`: Display packages
- `Pagination`: Navigate through pages

**Table Columns**:
- Title
- Travel Provider
- Departure Date
- Price Range
- Duration
- Status
- Actions

#### Form Pages (`/admin/packages/new`, `/admin/packages/[id]/edit`)

**Form Fields**:
```typescript
interface PackageFormData {
  title: string                   // Required
  travelId: string                // Required (select from travels)
  description: string             // Required
  duration: number                // Required (days)
  departureDate: Date             // Required
  returnDate: Date                // Required
  quota: number                   // Required
  pricingTiers: PricingTier[]     // Required (min 1)
  facilities: string[]            // Required (multi-select)
  itinerary: ItineraryDay[]       // Required
  images: (File | string)[]       // Required (multiple upload)
  status: 'active' | 'draft'      // Required
}

interface PricingTier {
  name: string                    // e.g., "Standard", "Premium", "VIP"
  price: number                   // Required
  hotelMakkah: string             // Required
  hotelMadinah: string            // Required
  roomType: string                // Required
  additionalFacilities: string[]  // Optional
}

interface ItineraryDay {
  day: number                     // Required
  title: string                   // Required
  activities: string[]            // Required
}
```

**Validation Rules**:
- Title: min 10 chars, max 200 chars
- Duration: min 5 days, max 30 days
- Return date must be after departure date
- Quota: min 1, max 500
- At least 1 pricing tier required
- At least 3 images required
- Images: max 5MB each, formats: jpg, png, webp

### 5. Content Management

#### List Page (`/admin/content`)

**Components**:
- `SearchFilter`: Search by title, filter by category/status
- `DataTable`: Display articles
- `Pagination`: Navigate through pages

**Table Columns**:
- Featured Image (thumbnail)
- Title
- Category
- Author
- Published Date
- Views
- Status
- Actions

#### Form Pages (`/admin/content/new`, `/admin/content/[id]/edit`)

**Form Fields**:
```typescript
interface BlogFormData {
  title: string                   // Required
  slug: string                    // Auto-generated from title
  excerpt: string                 // Required
  content: string                 // Required (rich text)
  featuredImage: File | string    // Required
  category: string                // Required (select)
  tags: string[]                  // Optional
  author: string                  // Required
  publishedAt: Date               // Required
  status: 'published' | 'draft'   // Required
  metaTitle?: string              // Optional (SEO)
  metaDescription?: string        // Optional (SEO)
}
```

**Validation Rules**:
- Title: min 10 chars, max 200 chars
- Excerpt: min 50 chars, max 300 chars
- Content: min 100 chars
- Featured image: max 5MB, formats: jpg, png, webp
- Slug: auto-generated, URL-safe

### 6. Hero Slider Management

#### List Page (`/admin/hero-slides`)

**Components**:
- `DraggableList`: Reorderable list of slides
- Preview thumbnails
- Order indicators
- Action buttons: Edit, Delete

**Features**:
- Drag-and-drop reordering
- Live preview
- Order number display

#### Form Pages (`/admin/hero-slides/new`, `/admin/hero-slides/[id]/edit`)

**Form Fields**:
```typescript
interface HeroSlideFormData {
  image: File | string            // Required
  title: string                   // Required
  subtitle?: string               // Optional
  description?: string            // Optional
  ctaText?: string                // Optional
  ctaLink?: string                // Optional
  order: number                   // Auto-assigned
  isActive: boolean               // Required
}
```

**Validation Rules**:
- Image: max 10MB, formats: jpg, png, webp
- Recommended dimensions: 1920x800px
- Title: min 5 chars, max 100 chars
- At least 1 active slide required

## Data Models

### Travel Provider Model

```typescript
interface Travel {
  id: string
  name: string
  slug: string
  logo: string
  city: string
  address: string
  phone: string
  email: string
  website?: string
  description: string
  certifications: string[]
  rating: number
  totalPackages: number
  status: 'active' | 'inactive'
  createdAt: Date
  updatedAt: Date
}
```

### Package Model

```typescript
interface Package {
  id: string
  title: string
  slug: string
  travelId: string
  travel?: Travel
  description: string
  duration: number
  departureDate: Date
  returnDate: Date
  quota: number
  bookedSeats: number
  pricingTiers: PricingTier[]
  facilities: string[]
  itinerary: ItineraryDay[]
  images: string[]
  status: 'active' | 'draft'
  createdAt: Date
  updatedAt: Date
}
```

### Blog Model

```typescript
interface Blog {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string
  featuredImage: string
  category: string
  tags: string[]
  author: string
  publishedAt: Date
  views: number
  status: 'published' | 'draft'
  metaTitle?: string
  metaDescription?: string
  createdAt: Date
  updatedAt: Date
}
```

### Hero Slide Model

```typescript
interface HeroSlide {
  id: string
  image: string
  title: string
  subtitle?: string
  description?: string
  ctaText?: string
  ctaLink?: string
  order: number
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}
```

## API Endpoints

### Travel Provider Endpoints

```
GET    /api/travels              # List all travels (with pagination, search, filter)
POST   /api/travels              # Create new travel
GET    /api/travels/[id]         # Get travel by ID
PUT    /api/travels/[id]         # Update travel
DELETE /api/travels/[id]         # Delete travel
```

**Query Parameters** (GET /api/travels):
- `page`: number (default: 1)
- `limit`: number (default: 10)
- `search`: string (search by name)
- `city`: string (filter by city)
- `status`: 'active' | 'inactive'

**Response Format**:
```typescript
{
  data: Travel[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}
```

### Package Endpoints

```
GET    /api/packages             # List all packages
POST   /api/packages             # Create new package
GET    /api/packages/[id]        # Get package by ID
PUT    /api/packages/[id]        # Update package
DELETE /api/packages/[id]        # Delete package
```

**Query Parameters** (GET /api/packages):
- `page`: number
- `limit`: number
- `search`: string
- `travelId`: string
- `status`: 'active' | 'draft'
- `dateFrom`: Date
- `dateTo`: Date

### Blog Endpoints

```
GET    /api/blogs                # List all blogs
POST   /api/blogs                # Create new blog
GET    /api/blogs/[id]           # Get blog by ID
PUT    /api/blogs/[id]           # Update blog
DELETE /api/blogs/[id]           # Delete blog
```

**Query Parameters** (GET /api/blogs):
- `page`: number
- `limit`: number
- `search`: string
- `category`: string
- `status`: 'published' | 'draft'

### Hero Slide Endpoints

```
GET    /api/hero-slides          # List all slides (ordered)
POST   /api/hero-slides          # Create new slide
GET    /api/hero-slides/[id]     # Get slide by ID
PUT    /api/hero-slides/[id]     # Update slide
DELETE /api/hero-slides/[id]     # Delete slide
POST   /api/hero-slides/reorder  # Reorder slides
```

**Reorder Request Body**:
```typescript
{
  slides: Array<{ id: string; order: number }>
}
```

### File Upload Endpoint

```
POST   /api/upload               # Upload file (image)
```

**Request**: multipart/form-data
**Response**:
```typescript
{
  url: string
  filename: string
  size: number
  mimeType: string
}
```

## Error Handling

### Error Response Format

```typescript
interface ErrorResponse {
  error: {
    code: string
    message: string
    details?: any
  }
}
```

### HTTP Status Codes

- `200 OK`: Successful GET, PUT
- `201 Created`: Successful POST
- `204 No Content`: Successful DELETE
- `400 Bad Request`: Validation error
- `404 Not Found`: Resource not found
- `409 Conflict`: Duplicate resource
- `500 Internal Server Error`: Server error

### Client-Side Error Handling

```typescript
// Toast notifications for user feedback
toast.success('Travel provider created successfully')
toast.error('Failed to create travel provider')
toast.warning('Please fill all required fields')

// Form validation errors
// Display inline with form fields using react-hook-form
```

### Validation Error Format

```typescript
{
  error: {
    code: 'VALIDATION_ERROR',
    message: 'Validation failed',
    details: {
      name: ['Name is required'],
      email: ['Invalid email format']
    }
  }
}
```

## Testing Strategy

### Unit Testing

**Tools**: Jest + React Testing Library

**Test Coverage**:
- Form validation logic
- Data transformation utilities
- API client functions
- Date/currency formatters

**Example Test Cases**:
```typescript
describe('TravelForm validation', () => {
  it('should validate required fields')
  it('should validate email format')
  it('should validate phone format')
  it('should validate image file size')
})
```

### Component Testing

**Test Coverage**:
- Form components render correctly
- Form submission handling
- Error display
- Loading states
- User interactions (clicks, inputs)

**Example Test Cases**:
```typescript
describe('TravelForm component', () => {
  it('should render all form fields')
  it('should display validation errors')
  it('should call onSubmit with form data')
  it('should disable submit button while loading')
})
```

### Integration Testing

**Test Coverage**:
- API route handlers
- CRUD operations
- File upload functionality
- Data persistence

**Example Test Cases**:
```typescript
describe('Travel API', () => {
  it('should create a new travel provider')
  it('should return paginated list of travels')
  it('should update existing travel')
  it('should delete travel and cascade to packages')
})
```

### E2E Testing (Optional)

**Tools**: Playwright or Cypress

**Test Scenarios**:
- Complete CRUD flow for each entity
- Form validation and error handling
- Navigation between pages
- Search and filter functionality
- Image upload workflow

## Performance Considerations

### Optimization Strategies

1. **Image Optimization**
   - Use Next.js Image component for automatic optimization
   - Lazy load images in lists
   - Generate thumbnails for list views
   - Use WebP format when supported

2. **Data Fetching**
   - Implement pagination for large lists
   - Use SWR for client-side caching
   - Prefetch data on hover (optional)
   - Implement debounced search

3. **Code Splitting**
   - Lazy load form components
   - Lazy load rich text editor
   - Split admin routes from public routes

4. **Caching**
   - Cache static data (categories, certifications)
   - Implement stale-while-revalidate strategy
   - Cache uploaded images with CDN (future)

### Performance Metrics

- Initial page load: < 2s
- Form submission: < 1s
- Image upload: < 3s (for 5MB file)
- Search results: < 500ms

## Security Considerations

### Authentication (Future Enhancement)

- Implement NextAuth.js for authentication
- Protect all admin routes with middleware
- Session-based authentication
- Role-based access control (admin, editor)

### Data Validation

- Server-side validation for all inputs
- Sanitize user inputs to prevent XSS
- Validate file uploads (type, size, content)
- Use Zod schemas for type-safe validation

### File Upload Security

- Validate file types (whitelist)
- Limit file sizes
- Generate unique filenames
- Store uploads outside public directory
- Scan for malicious content (future)

### API Security

- Validate request bodies
- Rate limiting (future)
- CSRF protection
- Input sanitization

## Accessibility

### WCAG 2.1 Level AA Compliance

- Semantic HTML elements
- Proper heading hierarchy
- Form labels and ARIA attributes
- Keyboard navigation support
- Focus indicators
- Color contrast ratios
- Screen reader support

### Specific Implementations

- Use `<label>` for all form inputs
- Provide `aria-label` for icon buttons
- Implement keyboard shortcuts for common actions
- Ensure all interactive elements are focusable
- Provide error announcements for screen readers

## Future Enhancements

### Phase 2 Features

1. **Authentication System**
   - User login/logout
   - Role-based permissions
   - Activity logging

2. **Advanced Analytics**
   - Dashboard charts and graphs
   - Package booking trends
   - Popular content analytics

3. **Bulk Operations**
   - Bulk delete
   - Bulk status update
   - CSV import/export

4. **Media Library**
   - Centralized image management
   - Image cropping and editing
   - Reusable media assets

5. **Email Notifications**
   - New booking alerts
   - Low quota warnings
   - Content publication notifications

6. **Booking Management**
   - View and manage bookings
   - Customer information
   - Payment tracking

7. **SEO Tools**
   - Meta tag management
   - Sitemap generation
   - Schema markup

8. **Multi-language Support**
   - Content translation
   - Language switcher
   - RTL support for Arabic

## Deployment Considerations

### Environment Variables

```env
# Database (future)
DATABASE_URL=

# File Upload
UPLOAD_DIR=/uploads
MAX_FILE_SIZE=10485760  # 10MB

# API
API_BASE_URL=http://localhost:3000

# Authentication (future)
NEXTAUTH_URL=
NEXTAUTH_SECRET=
```

### Build Configuration

- Enable static optimization where possible
- Configure image domains for external images
- Set up proper caching headers
- Minify and compress assets

### Hosting Requirements

- Node.js 18+ runtime
- Sufficient storage for uploads
- CDN for static assets (recommended)
- SSL certificate for HTTPS

