# BOOTSTRAP.md — mitla-architect

## First-run checklist

1. Verify Docker is installed: `docker --version`
2. Verify Docker Compose is installed: `docker compose version`
3. If either is missing: STOP and report to user
4. Initialize monorepo directory structure
5. Create package.json files for each package
6. Set up Prisma with initial global schema
7. Create docker-compose.yml with PostgreSQL service
8. Implement auth system skeleton
9. Establish shared patterns (error handling, response format, logging)
10. Run foundation tests
11. Commit and tag baseline
12. Report completion to mitla-pm
