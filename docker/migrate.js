import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import postgres from 'postgres';
import { URL } from 'url';

async function ensureDatabaseExists(databaseUrl) {
  const url = new URL(databaseUrl);
  const targetDbName = url.pathname.slice(1);
  
  if (!targetDbName || targetDbName === 'postgres') return;

  url.pathname = '/postgres';
  const defaultDbUrl = url.toString();

  const maxRetries = 10;
  let retries = 0;

  while (retries < maxRetries) {
    const client = postgres(defaultDbUrl, { max: 1, onnotice: () => {}, connect_timeout: 5 });
    try {
      const result = await client`SELECT 1 FROM pg_database WHERE datname = ${targetDbName}`;
      if (result.length === 0) {
        console.log(`⏳ Database "${targetDbName}" does not exist. Creating...`);
        await client.unsafe(`CREATE DATABASE "${targetDbName}"`);
        console.log(`✅ Database "${targetDbName}" created successfully!`);
      } else {
        console.log(`✅ Database "${targetDbName}" already exists.`);
      }
      await client.end();
      return;
    } catch (error) {
      await client.end().catch(() => {}); // Ignore end errors
      retries++;
      console.warn(`⚠️ Could not verify/create database (attempt ${retries}/${maxRetries}): ${error.message}`);
      if (retries >= maxRetries) {
        console.warn(`⚠️ Max retries reached for database creation check. Proceeding anyway...`);
        return;
      }
      await new Promise(resolve => setTimeout(resolve, 3000));
    }
  }
}

async function run() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    console.error("❌ DATABASE_URL environment variable is not defined");
    process.exit(1);
  }

  await ensureDatabaseExists(url);

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
