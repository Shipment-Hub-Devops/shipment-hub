variable "resource_group_name" {
  description = "The name of the resource group"
  type        = string
}

variable "location" {
  description = "The Azure region where resources will be created"
  type        = string
}

variable "my_public_ip" {
  description = "Your personal public IP address to allow SSH access to the Bastion"
  type        = string
}

variable "bastion_subnet_prefix" {
  description = "The address prefix of the Bastion subnet to allow internal SSH to the App VM"
  type        = string
}