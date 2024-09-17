#!/bin/bash

# Wait for the database to be ready
while ! nc -z db 5432; do
  echo "Waiting for PostgreSQL to be available..."
  sleep 1
done

# Run database migrations
flask db upgrade

# Start the Flask application
exec flask run --host=0.0.0.0