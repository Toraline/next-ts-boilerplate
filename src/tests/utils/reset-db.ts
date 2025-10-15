import prisma from "lib/prisma";

/**
 * Truncate all public tables in the database.
 * Uses CASCADE to clear dependent data and RESTART IDENTITY
 * to reset sequences (IDs start from 1 again).
 */
export async function resetDb() {
  await prisma.$executeRawUnsafe(`
    DO $$
    DECLARE
      statements CURSOR FOR
        SELECT tablename FROM pg_tables
        WHERE schemaname = 'public';
    BEGIN
      FOR stmt IN statements LOOP
        EXECUTE 'TRUNCATE TABLE "' || stmt.tablename || '" RESTART IDENTITY CASCADE;';
      END LOOP;
    END;
    $$;
  `);
}
