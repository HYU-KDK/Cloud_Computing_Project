resource "aws_s3_bucket" "pdf_bucket" {
  bucket = "${var.project_name}-pdfs-${random_id.suffix.hex}"
}

resource "random_id" "suffix" {
  byte_length = 4
}

# Block public access
resource "aws_s3_bucket_public_access_block" "pdf_bucket_access" {
  bucket = aws_s3_bucket.pdf_bucket.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}
