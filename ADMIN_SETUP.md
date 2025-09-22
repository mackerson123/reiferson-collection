# Admin Panel Setup

## Overview

A custom content management system for the Reiferson Collection that allows non-technical editing of collections and works.

## Access

- **URL**: `http://localhost:3000/admin` (in development) or `yourdomain.com/admin` (in production)
- **Password**: `reiferson2024` (change this in `app/admin/layout.tsx`)

## Features

### Collections Management

- Edit collection names, descriptions, and curator notes
- View collection statistics
- Real-time preview of changes

### Works Management

- Add, edit, and delete individual works
- Upload images directly or use image URLs
- Filter and search through works
- Organize works by collection
- Rich metadata editing including:
  - Title, artist, date
  - Medium, dimensions
  - Description and narrative
  - Provenance and exhibition history

### Image Upload

- Direct file upload to `/public` directory
- Automatic filename generation
- Image preview functionality
- Support for common image formats

## Data Storage

- Collections metadata: `data/json/collections.json`
- Works data: `data/json/works.json`
- Images: `public/` directory

## Security

- Password protection for admin access
- Local storage for session persistence
- No database required - all data stored in JSON files

## Usage Instructions

1. **Access Admin Panel**

   - Navigate to `/admin`
   - Enter the admin password

2. **Edit Collections**

   - Click "Collections" tab
   - Click "Edit" on any collection
   - Modify name, description, or curator note
   - Click "Save Changes"

3. **Manage Works**

   - Click "Works" tab
   - Use search and filters to find specific works
   - Click "Edit" (pencil icon) to modify a work
   - Click "Add New Work" to create new entries
   - Click "Delete" (trash icon) to remove works

4. **Upload Images**

   - In work editor, use the Image Upload section
   - Either paste an image URL or click "Upload File"
   - Images are automatically saved to the public directory

5. **Preview Changes**
   - Click "Preview Site" to see changes live
   - Changes are saved immediately and reflect on the main site

## File Structure

```
app/admin/
├── layout.tsx          # Admin authentication and layout
├── page.tsx           # Main admin dashboard
components/admin/
├── collection-editor.tsx  # Collection editing forms
├── work-editor.tsx       # Work editing forms
└── image-upload.tsx      # Image upload component
app/api/admin/
├── collections/route.ts  # Collection API endpoints
├── works/route.ts        # Works API endpoints
└── upload/route.ts       # Image upload API
data/json/
├── collections.json      # Collections metadata
└── works.json           # All works data
```

## Customization

### Change Admin Password

Edit `app/admin/layout.tsx`:

```tsx
const ADMIN_PASSWORD = "your-new-password";
```

### Modify Upload Directory

Edit `app/api/admin/upload/route.ts` to change where images are saved.

### Add New Fields

1. Update `lib/types.ts` to add new fields to Work or Collection interfaces
2. Add form fields in the respective editor components
3. Update API routes to handle new fields

## Backup

Regularly backup these files:

- `data/json/collections.json`
- `data/json/works.json`
- `public/` directory (for uploaded images)

## Troubleshooting

### Can't Access Admin Panel

- Check that you're using the correct password
- Clear browser localStorage if needed

### Images Not Uploading

- Check file permissions in `public/` directory
- Ensure file size is reasonable (< 10MB recommended)

### Changes Not Appearing

- Check browser console for errors
- Verify JSON files are being written correctly
- Restart development server if needed
