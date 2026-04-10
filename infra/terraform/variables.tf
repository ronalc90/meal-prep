variable "aws_region" {
  description = "Region de AWS"
  type        = string
  default     = "us-east-1"
}

variable "project_name" {
  description = "Nombre del proyecto"
  type        = string
  default     = "mealprep"
}

variable "environment" {
  description = "Entorno de despliegue"
  type        = string
  default     = "production"
}

variable "db_username" {
  description = "Usuario de la base de datos"
  type        = string
  sensitive   = true
}

variable "db_password" {
  description = "Password de la base de datos"
  type        = string
  sensitive   = true
}

variable "jwt_secret" {
  description = "Secret para firmar tokens JWT"
  type        = string
  sensitive   = true
}
