# Uploads Directory

This directory contains user-uploaded files, primarily profile photos.

## Structure
```
uploads/
├── avatars/          # User profile photos
│   ├── avatar-1234567890-abc123.jpg
│   └── avatar-1234567891-def456.png
└── temp/             # Temporary files (if needed)
```

## File Naming
- Format: `avatar-{timestamp}-{random}.{ext}`
- Maximum Size: 5MB
- Allowed Types: JPG, PNG, GIF

## Security
- Files are scanned for malware
- File size limits enforced
- Type validation performed
- Access logged and monitored

## Cleanup
- Temporary files cleaned regularly
- Orphaned files removed after 24 hours
- Database references maintained
