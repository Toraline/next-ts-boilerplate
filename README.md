# next-ts-todo

## Stack

- Next.js (app router)
- Typescript
- Jest + React Testing Library

## Running locally

- First run

    ```bash
    npm ci

    npm run services:up

    npm run prisma:migrate
    npm run prisma:generate

    npm run dev
    ```

- See the database

    ```bash
    npx prisma studio
    ```

- Run tests with watch (server needs to be up)

    ```bash
    npm run test:watch
    ```