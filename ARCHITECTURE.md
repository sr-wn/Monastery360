Monastery360 Workspace Architecture

This repository contains a Next.js frontend and a Spring Boot backend.

Frontend (v0-sikkim-monastery-platform)
- app/: routes and pages (App Router)
- components/: UI and feature components
  - core/: layout shell (Navigation, footer, theme-provider, error-boundary)
  - features/
    - ai/: ai-search-bar
    - archives/: digital-archive
    - calendar/: event-calendar
    - map/: interactive-map, map-component, simple-map
    - tours/: panorama-viewer
    - shared/: search-bar, helpers
  - ui/: shadcn-ui primitives
- lib/: api.ts, ai-search-api.ts, pdf-generator.ts, types.ts, utils.ts
- public/: static assets (images/, audio/, icons/, manifest)
- styles/: globals.css

Backend (v0-sikkim-monastery-platform/backend)
- src/main/java/com/monastery360/
  - config/: SecurityConfig
  - controller/: AuthController
  - security/: JwtUtil, JwtAuthFilter
- src/main/resources/: application.yml
- pom.xml

AI Search (ai-search-backend)
- FastAPI service for AI search endpoints

Environment
- Frontend .env.local
  - NEXT_PUBLIC_BACKEND_URL=http://localhost:8080
- Backend env/application.yml
  - GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET
  - APP_JWT_SECRET

Commands
- Frontend: npm install; npm run dev; npm run build && npm start
- Backend: mvn clean spring-boot:run

Links
- Frontend: http://localhost:3000
- Backend health: http://localhost:8080/health
- OAuth login: http://localhost:8080/oauth2/authorization/google













