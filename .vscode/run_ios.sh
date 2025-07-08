#!/bin/bash

echo "🚀 Starting iOS Simulator..."

# Change to Example directory
cd "${BASH_SOURCE%/*}/../Example"

# Kill any existing Metro bundler
pkill -f "metro" || true

# Clear Metro cache
echo "🧹 Clearing Metro cache..."
npx expo start --clear &

# Wait for Metro to start
sleep 5

# Run iOS
echo "📱 Launching iOS app..."
npx expo run:ios

# Keep the terminal open
read -p "Press any key to exit..."