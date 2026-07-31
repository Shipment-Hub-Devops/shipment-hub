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

# No default: the server name forms a globally unique DNS record, so a
# shared default fails with ServerNameAlreadyExists once any other tenant
# has used it. Always supplied from the root module.
variable "db_server_name" {
  description = "The name of the PostgreSQL server (globally unique)"
  type        = string
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