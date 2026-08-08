import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import postgres from 'postgres';

async function run() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    console.error("❌ DATABASE_URL environment variable is not defined");
    process.exit(1);
  }

  const maxRetries = 10;
  let retries = 0;
  let migrationClient;

  while (retries < maxRetries) {
    try {
      console.log(`⏳ Connecting to database (attempt ${retries + 1}/${maxRetries})...`);
      migrationClient = postgres(url, { max: 1, connect_timeout: 5 });
      // Test the connection by running a simple query
      await migrationClient`SELECT 1`;
      console.log("✅ Database connected successfully!");
      break;
    } catch (error) {
      retries++;
      console.warn(`⚠️ Database connection attempt failed: ${error.message}`);
      if (migrationClient) {
        await migrationClient.end();
      }
      if (retries >= maxRetries) {
        console.error("❌ Max database connection retries reached. Exiting.");
        process.exit(1);
      }
      console.log("⏳ Waiting 3 seconds before next attempt...");
      await new Promise(resolve => setTimeout(resolve, 3000));
    }
  }

  const db = drizzle(migrationClient);

  try {
    console.log("⏳ Applying migrations...");
    await migrate(db, { migrationsFolder: './drizzle' });
    console.log("✅ Database migrations successfully applied!");
  } catch (error) {
    console.error("❌ Database migration failed:", error);
    process.exit(1);
  } finally {
    await migrationClient.end();
  }
}

run();
