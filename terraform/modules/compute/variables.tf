variable "resource_group_name" {
  description = "The name of the resource group"
  type        = string
}

variable "location" {
  description = "The Azure region"
  type        = string
}

variable "bastion_subnet_id" {
  type = string
}

variable "app_subnet_id" {
  type = string
}

variable "bastion_public_ip_id" {
  type = string
}

variable "bastion_nsg_id" {
  type = string
}

variable "app_nsg_id" {
  type = string
}

variable "admin_username" {
  description = "Admin username for the VMs"
  type        = string
  default     = "azureadmin"
}

variable "ssh_public_key" {
  description = "The SSH public key string"
  type        = string
}

variable "app_vm_size" {
  description = "The size of the application VM"
  type        = string
  default     = "Standard_D2_v4"
}