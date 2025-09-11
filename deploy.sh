#!/usr/bin/env bash
# Render Deployment Script

set -e

echo "🚀 Starting Render deployment..."

# Navigate to client-side directory
cd client-side

echo "📦 Installing dependencies..."
npm ci

echo "🔍 Type checking..."
npm run type-check

echo "🏗️ Building application..."
npm run build

echo "✅ Build completed successfully!"
echo "🎯 Ready for deployment!"

# List build output
echo "📁 Build output:"
ls -la .next/

# Check if standalone output was created
if [ -d ".next/standalone" ]; then
    echo "✅ Standalone build created successfully"
else
    echo "❌ Standalone build not found"
    exit 1
fi
