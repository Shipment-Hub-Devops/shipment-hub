variable "resource_group_name" {
  description = "the name of the resource group"
  type        = string
}

variable "location" {
  description = "the Azure region where the resources will be created"
  type        = string
}

variable "vnet_address_space" {
  description = "the address space for the Virtual Network"
  type        = list(string)
  default     = ["10.0.0.0/16"]
}