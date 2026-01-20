# Security Group for EC2
resource "aws_security_group" "web_sg" {
  name        = "${var.project_name}-web-sg"
  description = "Allow HTTP/SSH/Postgres"
  vpc_id      = aws_default_vpc.default.id

  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"] # Restrict this in production!
  }
  
  ingress {
    from_port   = 3000
    to_port     = 3000
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  # Allow Postgres access for Lambda
  ingress {
    from_port   = 5432
    to_port     = 5432
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"] # Ideally restrict to Lambda IPs, but 0.0.0.0/0 required for public access without VPC
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

resource "aws_default_vpc" "default" {
  tags = {
    Name = "Default VPC"
  }
}

resource "aws_instance" "web_server" {
  ami           = "ami-0c7217cdde317cfec" # Ubuntu 22.04 LTS (US-East-1)
  instance_type = "t2.micro"
  key_name      = var.key_name 

  security_groups = [aws_security_group.web_sg.name]

  tags = {
    Name = "${var.project_name}-server"
  }

  # Script to install Docker, Run Postgres, and Setup Environment
  user_data = <<-EOF
              #!/bin/bash
              apt-get update
              apt-get install -y ca-certificates curl gnupg
              mkdir -m 0755 -p /etc/apt/keyrings
              curl -fsSL https://download.docker.com/linux/ubuntu/gpg | gpg --dearmor -o /etc/apt/keyrings/docker.gpg
              echo \
                "deb [arch="$(dpkg --print-architecture)" signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
                "$(. /etc/os-release && echo "$VERSION_CODENAME")" stable" | \
                tee /etc/apt/sources.list.d/docker.list > /dev/null
              apt-get update
              apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin git nodejs npm

              # Start Postgres via Docker
              docker run -d \
                --name postgres-db \
                -e POSTGRES_USER=pickleadmin \
                -e POSTGRES_PASSWORD=${var.db_password} \
                -e POSTGRES_DB=pickledb \
                -p 5432:5432 \
                postgres:16

              # Pull Project (Optional: You might want to scp copy files instead)
              # git clone https://github.com/HYU-KDK/Cloud_Computing_Project.git /home/ubuntu/app
              # cd /home/ubuntu/app
              # npm install ...
              EOF
}

variable "key_name" {
  description = "Name of the SSH Key Pair created in AWS Console"
  type        = string
}
