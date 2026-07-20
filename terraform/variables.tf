
variable "location" {
  type        = string
  description = "The Azure data center region"
  default     = "uaenorth"
}

variable "vm_size" {
  type        = string
  description = "The compute capacity of the virtual machine" 
  default     = "Standard_B2s"
}



variable "user_admin" {
  type        = string
  description = "The administrator username that will be used to SSH into the virtual machine"
  default     = "azureadmin"
}

variable "name_of_rg" {
  type        = string
  description = "The name of the resource Group that will be holding our Azure resources"
  default     = "azure-shipment"
}

# https://developer.hashicorp.com/terraform/language/values/variables used this resource write the variables format such as the type, description and setting the value