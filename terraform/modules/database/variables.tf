variable "resource_group_name" {
  description = "The name of the resource group"
  type        = string
}

variable "location" {
  description = "The Azure region"
  type        = string
}

variable "vnet_id" {
  description = "The ID of the Virtual Network "
  type        = string
}

variable "db_subnet_id" {
  description = "The ID of the delegated database subnet"
  type        = string
}

variable "db_server_name" {
  description = "The name of the PostgreSQL server"
  type        = string
  default     = "shipment-hub-pg-db001"
}

variable "db_admin_username" {
  description = "The admin username for the PostgreSQL server"
  type        = string
  default     = "pgadmin"
}

variable "db_admin_password" {
  description = "The admin password for the PostgreSQL server"
  type        = string
  sensitive   = true
}