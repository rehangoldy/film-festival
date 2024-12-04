# Database Backup

This folder contains the database backup for the Film Festival application.

## Current Version
- Version: v1
- Filename: v1_movie_festival_db.sql
- Date: December 2024

## Files Structure
```
/database
  /backup              # Folder untuk file backup database
    v1_movie_festival_db.sql  # File backup utama dari phpMyAdmin
  /migrations         # Folder untuk file migrasi (jika ada perubahan struktur di masa depan)
```

## How to Import Database

1. Create a new database in MySQL:
```sql
CREATE DATABASE film_festival;
```

2. Import using phpMyAdmin:
   - Open phpMyAdmin
   - Select your database
   - Go to "Import" tab
   - Choose the file `v1_movie_festival_db.sql`
   - Click "Go" to import

3. Or import using command line:
```bash
mysql -u your_username -p film_festival < v1_movie_festival_db.sql
```

## Version History
- v1 (Current): Initial database structure with movies, users, and voting system

## Backup Guidelines
- Create new backup before making major changes
- Use versioning in filename (v1, v2, etc.)
- Include date in backup description
- Test backup file by importing to a test database first
