# Recipe Sharing Application - Project Report

## Student Information

- **Name**: [Your Name]
- **Date**: November 13, 2025
- **Project**: Recipe Sharing Web Application

## Project Overview

This is a full-stack recipe sharing web application that allows users to create, read, update, and delete (CRUD) cooking recipes. The application features search, filter, and sort capabilities for easy recipe discovery.

## Technology Stack

### Frontend

- **Next.js 16**: React-based framework for server-side rendering and routing
- **React 19**: UI component library
- **TypeScript**: Type-safe JavaScript for better development experience
- **Tailwind CSS**: Utility-first CSS framework for styling

### Backend

- **Next.js API Routes**: Server-side API endpoints
- **Prisma ORM**: Database toolkit for type-safe database access
- **PostgreSQL**: Relational database (hosted on Supabase)

### Database & Hosting

- **Supabase**: PostgreSQL database hosting (free tier)
- **Vercel**: Frontend and API hosting platform (free tier)

## Features Implemented

### 1. Main Page (Recipe List) ✅

- Display all recipes in a responsive card grid layout
- Show recipe title, ingredients preview, tags, and image
- Search functionality by recipe title
- Filter recipes by tags (Vegan, Dessert, Quick, etc.)
- Sort recipes by title (A-Z/Z-A) or creation date
- Empty state when no recipes exist

### 2. Create Recipe ✅

- Form with validation for required fields (Title, Ingredients)
- Optional fields for tags and image URL
- Image preview functionality
- Redirect to main page after successful creation

### 3. Edit Recipe ✅

- Pre-populated form with existing recipe data
- Update all recipe fields
- Redirect to main page after saving
- Loading state while fetching recipe data

### 4. Delete Recipe ✅

- Delete button on each recipe card
- Confirmation prompt before deletion
- Immediate UI update after deletion

## Database Schema

```prisma
model Recipe {
  id          String   @id @default(cuid())
  title       String
  ingredients String
  tags        String?
  imageUrl    String?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

## API Endpoints

| Method | Endpoint            | Description                                  |
| ------ | ------------------- | -------------------------------------------- |
| GET    | `/api/recipes`      | Fetch all recipes with optional query params |
| POST   | `/api/recipes`      | Create a new recipe                          |
| GET    | `/api/recipes/[id]` | Fetch a single recipe by ID                  |
| PUT    | `/api/recipes/[id]` | Update a recipe by ID                        |
| DELETE | `/api/recipes/[id]` | Delete a recipe by ID                        |

## Development Process

### Setup Steps

1. Initialized Next.js project with TypeScript and Tailwind CSS
2. Installed and configured Prisma ORM
3. Connected to Supabase PostgreSQL database
4. Created database schema and pushed to production
5. Built API routes for CRUD operations
6. Developed UI components and pages
7. Implemented search, filter, and sort functionality
8. Added form validation and error handling

### Challenges Faced

1. **Environment Variables**: Ensured proper configuration for both development and production
2. **Database Schema**: Designed efficient schema with proper indexing for search and filter
3. **Client/Server Components**: Properly used 'use client' directive for interactive components
4. **Form State Management**: Managed complex form state with TypeScript types

### Solutions Implemented

1. Used Prisma for type-safe database queries
2. Implemented proper error handling in API routes
3. Added loading states for better user experience
4. Created responsive design with Tailwind CSS

## Testing

### Manual Testing Performed

- ✅ Create new recipes with all fields
- ✅ Create recipes with only required fields
- ✅ Search recipes by partial title match
- ✅ Filter by different tags
- ✅ Sort A-Z and Z-A
- ✅ Edit existing recipes
- ✅ Delete recipes with confirmation
- ✅ Image URL validation and preview
- ✅ Form validation for required fields

## Deployment

### Hosting Platform

- **Application**: Vercel (https://vercel.com)
- **Database**: Supabase (https://supabase.co)

### Deployment Steps

1. Pushed code to GitHub repository
2. Connected GitHub repo to Vercel
3. Configured environment variables in Vercel
4. Automatic deployment on every commit to main branch

### Live URLs

- **GitHub Repository**: [Your GitHub URL]
- **Live Application**: [Your Vercel URL]

## Future Enhancements

Potential improvements for future versions:

1. User authentication and authorization
2. Recipe rating and reviews system
3. Image upload to cloud storage (Cloudinary/S3)
4. Recipe categories and collections
5. Print-friendly recipe view
6. Share recipe via social media
7. Ingredient shopping list generator
8. Cooking timer integration
9. Nutritional information
10. Recipe import from URL

## Conclusion

This project successfully implements all required functional requirements for a recipe sharing application. The app is fully functional, deployed online, and provides a smooth user experience for managing cooking recipes. The use of modern web technologies (Next.js, Prisma, Supabase) ensures scalability and maintainability.

## Resources Used

- Next.js Documentation: https://nextjs.org/docs
- Prisma Documentation: https://www.prisma.io/docs
- Supabase Documentation: https://supabase.com/docs
- Tailwind CSS Documentation: https://tailwindcss.com/docs
- TypeScript Documentation: https://www.typescriptlang.org/docs

---

**Date Submitted**: November 13, 2025
**Development Time**: [Your time spent]
**Lines of Code**: ~800+
