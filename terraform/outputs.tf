output "ec2_public_ip" {
  value = aws_instance.web_server.public_ip
}

output "s3_bucket_name" {
  value = aws_s3_bucket.pdf_bucket.id
}

output "db_connection_string" {
  value     = "postgresql://pickleadmin:${var.db_password}@${aws_instance.web_server.public_ip}:5432/pickledb"
  sensitive = true
}
