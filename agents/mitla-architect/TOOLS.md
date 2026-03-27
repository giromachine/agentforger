# TOOLS.md — mitla-architect

## Available tools

- git: version control
- npm / npx: package management and Prisma CLI
- Docker / Docker Compose: containerization (must verify availability first)
- sessions_spawn: delegate to other agents if needed

## Prisma usage

All Prisma commands must use npx:
- `npx prisma migrate dev --name <migration_name>`
- `npx prisma generate`
- `npx prisma db push` (development only)

No global Prisma install is assumed or permitted.

## Docker constraint

Docker is NOT available inside the OpenClaw runtime. It must be installed on the target server manually before this agent executes. Step 1 of execution is to verify Docker and Docker Compose are present.
