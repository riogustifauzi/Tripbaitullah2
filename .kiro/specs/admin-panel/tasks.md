# Implementation Plan - Panel Admin Tripbaitullah

## Overview

This implementation plan breaks down the admin panel development into discrete, manageable coding tasks. Each task builds incrementally on previous work, ensuring a systematic approach to building the complete admin system.

## Tasks

- [x] 1. Set up data layer and API infrastructure


  - Create TypeScript type definitions for all data models (Travel, Package, Blog, HeroSlide)
  - Create JSON data files structure in lib/data/ directory
  - Implement data access utilities for reading and writing JSON files
  - Create Zod validation schemas for all models
  - _Requirements: 2.3, 2.6, 3.3, 3.7, 4.3, 4.7, 7.3, 7.7_







- [ ] 2. Implement API routes for Travel Provider management
  - [x] 2.1 Create GET /api/travels route with pagination, search, and filter

    - Implement query parameter parsing (page, limit, search, city, status)
    - Add pagination logic and response formatting
    - _Requirements: 2.1_


  



  - [x] 2.2 Create POST /api/travels route for creating travel providers




    - Implement request validation using Zod schema

    - Add data persistence to JSON file




    - Generate unique ID and slug
    - _Requirements: 2.2, 2.3, 2.6_


  



  - [ ] 2.3 Create GET /api/travels/[id] route for fetching single travel
    - Implement ID validation and error handling for not found
    - _Requirements: 2.1_








  
  - [x] 2.4 Create PUT /api/travels/[id] route for updating travel providers


    - Implement validation and data update logic




    - _Requirements: 2.4, 2.6_
  
  - [ ] 2.5 Create DELETE /api/travels/[id] route for deleting travel providers
    - Implement cascade logic to check for associated packages




    - Add confirmation requirement
    - _Requirements: 2.5_








- [ ] 3. Implement API routes for Package management
  - [ ] 3.1 Create GET /api/packages route with pagination and filters
    - Implement query parameters (page, limit, search, travelId, status, dateFrom, dateTo)

    - Add travel provider data population
    - _Requirements: 3.1_





  




  - [ ] 3.2 Create POST /api/packages route for creating packages
    - Implement validation for package data including pricing tiers

    - Add date validation (return date after departure date)
    - _Requirements: 3.2, 3.3, 3.4, 3.7_
  
  - [x] 3.3 Create GET /api/packages/[id] route for fetching single package

    - Populate related travel provider data
    - _Requirements: 3.1_
  

  - [ ] 3.4 Create PUT /api/packages/[id] route for updating packages
    - Implement validation and update logic
    - _Requirements: 3.5, 3.7_

  


  - [x] 3.5 Create DELETE /api/packages/[id] route for deleting packages




    - Add confirmation requirement
    - _Requirements: 3.6_




- [ ] 4. Implement API routes for Blog/Content management
  - [ ] 4.1 Create GET /api/blogs route with pagination and filters
    - Implement query parameters (page, limit, search, category, status)
    - _Requirements: 4.1_

  

  - [ ] 4.2 Create POST /api/blogs route for creating blog articles
    - Implement validation for blog data

    - Auto-generate slug from title
    - _Requirements: 4.2, 4.3, 4.7_

  
  - [x] 4.3 Create GET /api/blogs/[id] route for fetching single blog

    - Increment view counter on fetch





    - _Requirements: 4.1_
  

  - [ ] 4.4 Create PUT /api/blogs/[id] route for updating blog articles
    - Implement validation and update logic
    - _Requirements: 4.5, 4.7_
  



  - [ ] 4.5 Create DELETE /api/blogs/[id] route for deleting blog articles
    - Add confirmation requirement




    - _Requirements: 4.6_


- [ ] 5. Implement API routes for Hero Slider management
  - [x] 5.1 Create GET /api/hero-slides route to fetch all slides ordered


    - Sort by order field ascending
    - _Requirements: 7.1_
  
  - [x] 5.2 Create POST /api/hero-slides route for creating slides


    - Auto-assign order number (max + 1)
    - Implement validation





    - _Requirements: 7.2, 7.3_

  
  - [x] 5.3 Create PUT /api/hero-slides/[id] route for updating slides




    - Implement validation and update logic
    - _Requirements: 7.5_
  

  - [ ] 5.4 Create DELETE /api/hero-slides/[id] route for deleting slides
    - Validate at least one slide remains




    - Reorder remaining slides
    - _Requirements: 7.6, 7.7_


  
  - [x] 5.5 Create POST /api/hero-slides/reorder route for reordering slides


    - Accept array of {id, order} and update all slides

    - _Requirements: 7.4_

- [x] 6. Implement file upload functionality


  - [ ] 6.1 Create POST /api/upload route for image uploads
    - Implement file type validation (jpg, png, webp)

    - Add file size validation (max 10MB)







    - Generate unique filenames
    - Save files to public/uploads directory
    - Return file URL and metadata
    - _Requirements: 2.3, 3.3, 4.3, 7.3_


  

  - [ ] 6.2 Create image optimization utilities
    - Implement thumbnail generation for list views
    - Add image compression logic
    - _Requirements: 2.1, 3.1, 4.1_




- [ ] 7. Build admin layout and navigation components
  - [ ] 7.1 Create AdminLayout component with sidebar and header
    - Implement responsive sidebar (collapsible on mobile)
    - Add fixed header with logo and profile area
    - Create main content wrapper with proper spacing



    - _Requirements: 5.1, 5.3, 5.5_
  
  - [ ] 7.2 Create AdminSidebar component with navigation links
    - Implement navigation menu with icons (Dashboard, Travels, Packages, Content, Hero Slides)
    - Add active route highlighting



    - Make sidebar collapsible
    - _Requirements: 5.1, 5.2_
  
  - [x] 7.3 Create AdminHeader component








    - Add logout button placeholder
    - Implement responsive design
    - _Requirements: 5.3, 5.4_



- [x] 8. Build Dashboard page

  - [ ] 8.1 Create StatsCard component for displaying metrics
    - Design card with icon, label, and value
    - Add gradient backgrounds
    - _Requirements: 1.1, 1.2, 1.3, 1.4_
  

  - [x] 8.2 Implement Dashboard page with statistics


    - Fetch and display total counts (travels, packages, blogs, bookings)
    - Create grid layout for stats cards
    - _Requirements: 1.1, 1.2, 1.3, 1.4_

  
  - [x] 8.3 Add recent activities section to Dashboard



    - Display recent 5 items from each category

    - Add quick action buttons
    - _Requirements: 1.5_


- [x] 9. Build reusable data table components

  - [x] 9.1 Create DataTable component with sorting






    - Implement sortable column headers
    - Add row selection capability
    - Style table with proper spacing and borders
    - _Requirements: 6.1_
  
  - [x] 9.2 Create Pagination component



    - Implement page navigation controls
    - Display current page and total pages
    - Add page size selector

    - _Requirements: 6.2_


  
  - [x] 9.3 Create SearchFilter component

    - Implement search input with debounce
    - Add filter dropdowns
    - Create clear filters button





    - _Requirements: 2.1, 3.1, 4.1_

- [ ] 10. Build Travel Provider management pages
  - [x] 10.1 Create Travel list page (/admin/travels)



    - Implement DataTable with travel provider data
    - Add SearchFilter for name, city, status
    - Implement Pagination
    - Add action buttons (View, Edit, Delete) for each row

    - _Requirements: 2.1, 6.1, 6.2, 6.6_

  





  - [x] 10.2 Create TravelForm component

    - Build form with all required fields (name, logo, city, address, phone, email, website, description, certifications, rating, status)
    - Implement ImageUpload component for logo
    - Add form validation with react-hook-form and Zod

    - Display inline validation errors


    - _Requirements: 2.3, 2.6, 8.1, 8.3_


  


  - [ ] 10.3 Create Add Travel page (/admin/travels/new)
    - Integrate TravelForm component
    - Implement form submission to POST /api/travels
    - Add loading state during submission





    - Show success/error notifications
    - Redirect to list page on success
    - _Requirements: 2.2, 2.3, 6.3, 6.4, 8.2_
  


  - [ ] 10.4 Create Edit Travel page (/admin/travels/[id]/edit)
    - Fetch existing travel data
    - Pre-populate TravelForm with existing data
    - Implement form submission to PUT /api/travels/[id]


    - Add cancel button to return to list
    - _Requirements: 2.4, 2.6, 8.5_

  


  - [x] 10.5 Implement delete functionality with confirmation

    - Create ConfirmDialog component
    - Show confirmation dialog on delete button click


    - Call DELETE /api/travels/[id] on confirm
    - Update list after successful deletion
    - _Requirements: 2.5, 6.5_


- [x] 11. Build Package management pages


  - [ ] 11.1 Create Package list page (/admin/packages)
    - Implement DataTable with package data
    - Add SearchFilter for title, travel, date, status
    - Display travel provider name with each package


    - Add action buttons (View, Edit, Delete)
    - _Requirements: 3.1, 6.1, 6.2, 6.6_
  
  - [x] 11.2 Create PackageForm component


    - Build form with all fields (title, travelId, description, duration, dates, quota, facilities, itinerary, images, status)
    - Implement dynamic pricing tiers section (add/remove tiers)
    - Implement dynamic itinerary section (add/remove days)


    - Add multiple image upload capability


    - Implement date validation (return after departure)
    - Add form validation with react-hook-form and Zod
    - _Requirements: 3.3, 3.4, 3.7, 8.1, 8.3_
  
  - [x] 11.3 Create Add Package page (/admin/packages/new)


    - Integrate PackageForm component
    - Fetch travel providers for dropdown
    - Implement form submission to POST /api/packages
    - Add loading state and notifications
    - _Requirements: 3.2, 3.3, 6.3, 6.4, 8.2_


  
  - [ ] 11.4 Create Edit Package page (/admin/packages/[id]/edit)
    - Fetch existing package data
    - Pre-populate PackageForm with existing data
    - Implement form submission to PUT /api/packages/[id]
    - _Requirements: 3.5, 3.7, 8.5_
  
  - [ ] 11.5 Implement delete functionality with confirmation
    - Use ConfirmDialog component
    - Call DELETE /api/packages/[id] on confirm
    - _Requirements: 3.6, 6.5_

- [ ] 12. Build Content/Blog management pages
  - [ ] 12.1 Create Blog list page (/admin/content)
    - Implement DataTable with blog data





    - Add SearchFilter for title, category, status
    - Display featured image thumbnails
    - Show view count for each article
    - Add action buttons (View, Edit, Delete)
    - _Requirements: 4.1, 6.1, 6.2, 6.6_
  


  - [ ] 12.2 Create RichTextEditor component
    - Integrate TipTap or React Quill
    - Add formatting toolbar (bold, italic, headings, lists, links)
    - Implement image insertion capability
    - _Requirements: 4.4_


  
  - [ ] 12.3 Create BlogForm component
    - Build form with all fields (title, excerpt, content, featuredImage, category, tags, author, publishedAt, status)
    - Integrate RichTextEditor for content field
    - Auto-generate slug from title


    - Add form validation with react-hook-form and Zod
    - _Requirements: 4.3, 4.4, 4.7, 8.1, 8.3_
  
  - [ ] 12.4 Create Add Blog page (/admin/content/new)
    - Integrate BlogForm component
    - Implement form submission to POST /api/blogs
    - Add loading state and notifications
    - _Requirements: 4.2, 4.3, 6.3, 6.4, 8.2_
  
  - [ ] 12.5 Create Edit Blog page (/admin/content/[id]/edit)
    - Fetch existing blog data
    - Pre-populate BlogForm with existing data
    - Implement form submission to PUT /api/blogs/[id]
    - _Requirements: 4.5, 4.7, 8.5_
  
  - [ ] 12.6 Implement delete functionality with confirmation
    - Use ConfirmDialog component
    - Call DELETE /api/blogs/[id] on confirm
    - _Requirements: 4.6, 6.5_

- [ ] 13. Build Hero Slider management pages
  - [ ] 13.1 Create Hero Slides list page (/admin/hero-slides)
    - Implement draggable list with react-beautiful-dnd or dnd-kit
    - Display slide thumbnails with order numbers
    - Add reorder functionality with drag-and-drop
    - Show active/inactive status for each slide
    - Add action buttons (Edit, Delete)
    - _Requirements: 7.1, 7.4, 6.6_
  
  - [ ] 13.2 Implement slide reordering functionality
    - Handle drag-and-drop events
    - Call POST /api/hero-slides/reorder with new order
    - Update UI optimistically
    - _Requirements: 7.4_
  
  - [ ] 13.3 Create HeroSlideForm component
    - Build form with all fields (image, title, subtitle, description, ctaText, ctaLink, isActive)
    - Add large image upload with preview
    - Add form validation with react-hook-form and Zod
    - _Requirements: 7.3, 8.1, 8.3_
  
  - [ ] 13.4 Create Add Hero Slide page (/admin/hero-slides/new)
    - Integrate HeroSlideForm component
    - Implement form submission to POST /api/hero-slides
    - Add loading state and notifications
    - _Requirements: 7.2, 7.3, 6.3, 6.4, 8.2_
  
  - [ ] 13.5 Create Edit Hero Slide page (/admin/hero-slides/[id]/edit)
    - Fetch existing slide data
    - Pre-populate HeroSlideForm with existing data
    - Implement form submission to PUT /api/hero-slides/[id]
    - _Requirements: 7.5, 8.5_
  
  - [ ] 13.6 Implement delete functionality with validation
    - Check if at least one slide will remain
    - Show error if trying to delete last slide
    - Use ConfirmDialog for confirmation
    - Call DELETE /api/hero-slides/[id] on confirm
    - _Requirements: 7.6, 7.7, 6.5_

- [ ] 14. Build shared UI components
  - [ ] 14.1 Create ImageUpload component
    - Implement drag-and-drop file upload
    - Add file preview before upload
    - Show upload progress
    - Display validation errors (file type, size)
    - Support single and multiple file uploads
    - _Requirements: 2.3, 3.3, 4.3, 7.3_
  
  - [ ] 14.2 Create Notification/Toast component
    - Implement toast notification system
    - Support success, error, warning, info types
    - Add auto-dismiss functionality
    - Position toasts in top-right corner
    - _Requirements: 6.4, 6.5_
  
  - [ ] 14.3 Create ConfirmDialog component
    - Build modal dialog for confirmations
    - Add customizable title and message
    - Implement confirm and cancel buttons
    - Add loading state during action
    - _Requirements: 2.5, 3.6, 4.6, 7.6_
  
  - [ ] 14.4 Create LoadingSpinner component
    - Design spinner animation
    - Support different sizes
    - Add overlay variant for full-page loading
    - _Requirements: 6.3, 8.2_

- [ ] 15. Implement form validation and error handling
  - [ ] 15.1 Create validation utilities and error formatting
    - Implement helper functions for common validations (email, phone, URL)
    - Create error message formatter for Zod errors
    - Add field-level error display logic
    - _Requirements: 8.1, 8.3_
  
  - [ ] 15.2 Add loading states to all forms
    - Disable submit button during submission
    - Show loading spinner on submit button
    - Prevent multiple submissions
    - _Requirements: 8.2_
  
  - [ ] 15.3 Implement cancel functionality for all forms
    - Add cancel button to all forms
    - Show confirmation dialog if form has unsaved changes
    - Navigate back to list page on cancel
    - _Requirements: 8.5_

- [ ] 16. Add data fetching and caching with SWR
  - [ ] 16.1 Create API client functions
    - Implement fetch wrappers for all API endpoints
    - Add error handling and response parsing
    - Create TypeScript types for API responses
    - _Requirements: 2.1, 3.1, 4.1, 7.1_
  
  - [ ] 16.2 Integrate SWR for data fetching
    - Set up SWR configuration with global options
    - Implement SWR hooks for each data type
    - Add revalidation on focus and reconnect
    - Implement optimistic updates for mutations
    - _Requirements: 6.3_

- [ ] 17. Implement search and filter functionality
  - [ ] 17.1 Add debounced search to all list pages
    - Implement useDebounce hook
    - Connect search input to API query parameters
    - Show loading indicator during search
    - _Requirements: 2.1, 3.1, 4.1_
  
  - [ ] 17.2 Implement filter dropdowns
    - Create filter UI for each list page
    - Connect filters to API query parameters
    - Add clear filters functionality
    - Persist filters in URL query string
    - _Requirements: 2.1, 3.1, 4.1_

- [ ] 18. Add responsive design and mobile optimization
  - [ ] 18.1 Make admin layout responsive
    - Implement collapsible sidebar for mobile
    - Add hamburger menu button
    - Adjust spacing and padding for mobile
    - _Requirements: 5.5_
  
  - [ ] 18.2 Optimize tables for mobile view
    - Implement card view for mobile devices
    - Make tables horizontally scrollable
    - Adjust column visibility based on screen size
    - _Requirements: 6.1_
  
  - [ ] 18.3 Optimize forms for mobile
    - Stack form fields vertically on mobile
    - Adjust input sizes for touch targets
    - Make image uploads mobile-friendly
    - _Requirements: 8.1_

- [ ] 19. Implement accessibility features
  - [ ] 19.1 Add ARIA labels and semantic HTML
    - Use proper heading hierarchy
    - Add aria-label to icon buttons
    - Implement proper form labels
    - Add role attributes where needed
    - _Requirements: 5.1, 6.6, 8.1_
  
  - [ ] 19.2 Implement keyboard navigation
    - Ensure all interactive elements are focusable
    - Add visible focus indicators
    - Implement keyboard shortcuts for common actions
    - Test tab order throughout the application
    - _Requirements: 5.2, 6.6_
  
  - [ ] 19.3 Add screen reader support
    - Implement live regions for notifications
    - Add descriptive text for images
    - Ensure error messages are announced
    - Test with screen reader software
    - _Requirements: 6.4, 6.5, 8.1_

- [ ]* 20. Add error boundaries and error pages
  - [ ]* 20.1 Create error boundary component
    - Implement React error boundary
    - Add fallback UI for errors
    - Log errors to console
    - _Requirements: 6.5_
  
  - [ ]* 20.2 Create 404 and error pages
    - Design 404 not found page
    - Create generic error page
    - Add navigation back to dashboard
    - _Requirements: 6.5_

- [ ]* 21. Implement data validation and sanitization
  - [ ]* 21.1 Add server-side validation to all API routes
    - Validate all request bodies with Zod schemas
    - Return proper validation error responses
    - Sanitize user inputs to prevent XSS
    - _Requirements: 2.6, 3.7, 4.7, 7.3, 8.3_
  
  - [ ]* 21.2 Add file upload security
    - Validate file MIME types on server
    - Check file content, not just extension
    - Generate unique, safe filenames
    - Limit upload directory access
    - _Requirements: 2.3, 3.3, 4.3, 7.3_

- [ ]* 22. Add performance optimizations
  - [ ]* 22.1 Implement image optimization
    - Generate thumbnails for list views
    - Use Next.js Image component everywhere
    - Add lazy loading for images
    - Implement WebP format conversion
    - _Requirements: 2.1, 3.1, 4.1_
  
  - [ ]* 22.2 Optimize data fetching
    - Implement pagination on server side
    - Add data caching with SWR
    - Prefetch data on hover (optional)
    - _Requirements: 6.2_
  
  - [ ]* 22.3 Add code splitting
    - Lazy load form components
    - Lazy load rich text editor
    - Split routes with dynamic imports
    - _Requirements: 5.1_

- [ ]* 23. Create utility functions and helpers
  - [ ]* 23.1 Create date formatting utilities
    - Implement date formatter for display
    - Add relative time formatter (e.g., "2 days ago")
    - Create date range validator
    - _Requirements: 3.3, 4.3_
  
  - [ ]* 23.2 Create currency formatting utilities
    - Implement Indonesian Rupiah formatter
    - Add number formatting with thousand separators
    - _Requirements: 3.3_
  
  - [ ]* 23.3 Create slug generation utility
    - Implement URL-safe slug generator
    - Add uniqueness check
    - Handle special characters and spaces
    - _Requirements: 2.3, 3.3, 4.3_

