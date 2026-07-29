variable "resource_group_name" {
  description = "The name of the resource group"
  type        = string
}

variable "location" {
  description = "The Azure region"
  type        = string
}

variable "registry_name" {
  description = "The name of the container registry"
  type        = string
  default     = "azureshipmentacr001" 
}