variable "location" {
  type        = string
  description = "The Azure data center region"
  default     = "uaenorth"
}

variable "name_of_rg" {
  type        = string
  description = "Resource group holding all Azure resources"
  default     = "azure-shipment"
}

variable "vm_size" {
  type        = string
  description = "VM size for both the app VM and the jumpbox (no B-series capacity in uaenorth)"
  default     = "Standard_D2_v4"
}

variable "user_admin" {
  type        = string
  description = "Admin username used to SSH into the VMs"
  default     = "azureadmin"
}

variable "ssh_public_key_path" {
  type        = string
  description = "Path to the SSH public key installed on the VMs"
  default     = "~/.ssh/id_rsa.pub"
}

variable "app_private_ip" {
  type        = string
  description = "Static private IP of the app VM (the jumpbox forwards traffic here)"
  default     = "10.0.2.10"
}

variable "app_port" {
  type        = number
  description = "Port the application listens on"
  default     = 4000
}

variable "acr_name" {
  type        = string
  description = "Globally unique name of the Azure Container Registry (alphanumeric only)"
  default     = "shipmenthubacr2026"
}

variable "db_admin" {
  type        = string
  description = "Administrator login for the managed PostgreSQL server"
  default     = "pgadmin"
}

variable "db_password" {
  type        = string
  description = "Administrator password for the managed PostgreSQL server (pass via TF_VAR_db_password — never hardcode)"
  sensitive   = true
}

variable "db_sku" {
  type        = string
  description = "SKU for the PostgreSQL flexible server"
  default     = "B_Standard_B1ms"
}
