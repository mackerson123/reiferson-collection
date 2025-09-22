# How to Use the Admin Panel

## Quick Start

1. Go to `http://localhost:3000/admin`
2. Enter password: `reiferson2024`
3. Click "Login"

## Making Changes

### Edit Collections

1. Click the "Collections" tab
2. Click "Edit" on any collection
3. Make your changes
4. Click "Save Changes"

### Manage Works (Photos)

1. Click the "Works" tab
2. **To edit a work**: Click the pencil icon (✏️)
3. **To delete a work**: Click the trash icon (🗑️)
4. **To add a new work**: Click "Add New Work"

### Upload Images

1. When editing or creating a work, scroll to the "Image" section
2. Either:
   - Paste an image URL in the text field, OR
   - Click "Upload File" to select from your computer
3. You'll see a preview of the image

## Seeing Your Changes

**Important**: After making changes in the admin panel, you need to refresh the main gallery to see them:

1. Click "Preview Site" to open the main gallery in a new tab
2. **Refresh the browser page** (press F5 or Ctrl+R / Cmd+R)
3. Your changes should now appear!

### Why do I need to refresh?

The gallery loads data when the page first opens. After you make changes in the admin panel, you need to refresh the gallery page to load the updated data.

## Tips

- **Search works**: Use the search box to find specific photos by title, artist, or description
- **Filter by collection**: Use the dropdown to show only works from a specific collection
- **Image formats**: Upload JPG, PNG, GIF, or WebP images
- **Backup**: Your changes are saved to files in the `data/json/` folder

## Troubleshooting

**Changes don't appear in gallery:**

- Make sure you refreshed the gallery page after making changes
- Check that you clicked "Save Changes" in the admin panel

**Can't upload images:**

- Make sure the image file is not too large (under 10MB recommended)
- Try using a different image format (JPG or PNG work best)

**Forgot the password:**

- The password is: `reiferson2024`
- It can be changed in the file `app/admin/layout.tsx`
