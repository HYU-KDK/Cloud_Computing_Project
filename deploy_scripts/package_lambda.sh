#!/bin/bash

# Navigate to lambda directory
cd aws/lambda

# Install dependencies (production only)
npm install --production

# Zip the contents
zip -r ../../lambda_function.zip .

echo "Created lambda_function.zip in project root."
