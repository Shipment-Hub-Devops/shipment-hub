output "registry_login_server" {
  description = "The URL that can be used to log into the container registry"
  value       = azurerm_container_registry.acr.login_server
}

output "registry_admin_username" {
  description = "The Username of the Container Registry Admin account"
  value       = azurerm_container_registry.acr.admin_username
}

output "registry_admin_password" {
  description = "The Password of the Container Registry Admin account"
  value       = azurerm_container_registry.acr.admin_password
  sensitive   = true
}