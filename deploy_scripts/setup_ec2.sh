#!/bin/bash

# 1. Update and Install Dependencies
sudo apt-get update
sudo apt-get install -y git nodejs npm docker.io

# 2. Start Docker
sudo systemctl start docker
sudo systemctl enable docker
sudo usermod -aG docker ubuntu

# 3. clone (if not exists) or pull
if [ -d "paperquest" ]; then
  cd paperquest
  git pull origin feature/aws-backend
else
  git clone -b feature/aws-backend https://github.com/HYU-KDK/Cloud_Computing_Project.git paperquest
  cd paperquest
fi

# 4. Run Postgres Docker Container
# Stop existing if any
sudo docker stop postgres-db || true
sudo docker rm postgres-db || true

# Run new container (PASSWORD set to 'paperquest' for simplicity, change in production)
sudo docker run -d \
  --name postgres-db \
  -e POSTGRES_USER=pickleadmin \
  -e POSTGRES_PASSWORD=paperquest \
  -e POSTGRES_DB=pickledb \
  -p 5432:5432 \
  postgres:16

# Wait for DB to start
sleep 10

# 5. Setup Server
cd server
npm install
npm run build
# Create .env file
cat <<EOF > .env
DATABASE_URL="postgresql://pickleadmin:paperquest@localhost:5432/pickledb?schema=public"
AWS_REGION="us-east-1"
BEDROCK_MODEL_ID="anthropic.claude-3-sonnet-20240229-v1:0"
PORT=3000
EOF

# Push Schema to DB
npx prisma db push

# 6. Setup Client
cd ../client
npm install
npm run build

# 7. Start Application (using PM2 for background process)
sudo npm install -g pm2
cd ../server
pm2 delete paperquest-server || true
pm2 start dist/server.js --name paperquest-server

echo "Deployment Complete! Project running on port 3000."
