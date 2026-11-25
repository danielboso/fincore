#!/bin/sh
set -e

echo "Starting Fincore Container Initialization..."

# Run database migrations
node ./migrate.mjs

# Execute the application
echo "Starting Nitro application server..."
exec node .output/server/index.mjs
