# Registry module — private Azure Container Registry

variable "location" { type = string }
variable "resource_group_name" { type = string }
variable "acr_name" { type = string }

resource "azurerm_container_registry" "acr" {
  name                = var.acr_name
  location            = var.location
  resource_group_name = var.resource_group_name
  sku                 = "Basic"
  # Admin account keeps CD authentication simple (credentials stored as
  # GitHub secrets). For production you'd prefer a service principal.
  admin_enabled = true
}

output "login_server" { value = azurerm_container_registry.acr.login_server }
output "admin_username" {
  value     = azurerm_container_registry.acr.admin_username
  sensitive = true
}
output "admin_password" {
  value     = azurerm_container_registry.acr.admin_password
  sensitive = true
}
