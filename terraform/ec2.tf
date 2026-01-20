# Security Group for EC2
resource "aws_security_group" "web_sg" {
  name        = "${var.project_name}-web-sg"
  description = "Allow HTTP/SSH"
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
  ami           = "ami-0c7217cdde317cfec" # Ubuntu 22.04 LTS (Update for your region!)
  instance_type = "t2.micro"
  key_name      = var.key_name # You need to create this Key Pair in AWS Console manually

  security_groups = [aws_security_group.web_sg.name]

  tags = {
    Name = "${var.project_name}-server"
  }

  user_data = <<-EOF
              #!/bin/bash
              apt-get update
              apt-get install -y nodejs npm git
              # Add more setup scripts here (git clone, npm install, pm2 start, etc.)
              EOF
}

variable "key_name" {
  description = "Name of the SSH Key Pair created in AWS Console"
  type        = string
}
