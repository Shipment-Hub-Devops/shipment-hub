variable "name_of_rg" {
  description = "The name of the resource group"
  type        = string
  default     = "azure-shipment"
}

variable "location" {
  description = "The Azure region"
  type        = string
  default     = "uaenorth"
}

variable "user_admin" {
  description = "Admin username for the VMs"
  type        = string
  default     = "azureadmin"
}

variable "ssh_public_key_path" {
  description = "Path to the SSH public key"
  type        = string
  default     = "~/.ssh/id_rsa.pub"
}

variable "my_public_ip" {
  description = "Your personal public IP address to allow SSH access to the Bastion (e.g., '203.0.113.50/32')"
  type        = string
}

variable "registry_name" {
  description = "The name of the container registry"
  type        = string
}

# Like registry_name, this is part of a globally unique DNS name
# (<name>.postgres.database.azure.com), so it cannot carry a default —
# a shared default collides with any other tenant that kept theirs.
variable "db_server_name" {
  description = "Globally unique name for the PostgreSQL flexible server"
  type        = string
}

variable "db_admin_password" {
  description = "Password for the database administrator"
  type        = string
  sensitive   = true
}

# Intentionally has no default: see the comment in providers.tf.
variable "subscription_id" {
  description = "Azure subscription ID to deploy into (az account list -o table)"
  type        = string
}