output "jumpbox_public_ip" {
  description = "Public IP of the jumpbox — SSH entry point and public URL for the app"
  value       = module.compute.jumpbox_public_ip
}

output "app_vm_private_ip" {
  description = "Private IP of the application VM"
  value       = module.compute.app_vm_private_ip
}

output "acr_login_server" {
  description = "Login server of the container registry"
  value       = module.registry.login_server
}

output "acr_admin_username" {
  description = "Admin username for the registry (used by the CD pipeline)"
  value       = module.registry.admin_username
  sensitive   = true
}

output "acr_admin_password" {
  description = "Admin password for the registry (used by the CD pipeline)"
  value       = module.registry.admin_password
  sensitive   = true
}

output "postgres_fqdn" {
  description = "FQDN of the managed PostgreSQL server"
  value       = module.database.fqdn
}

output "database_url" {
  description = "Full connection string for the application"
  value       = "postgres://${var.db_admin}:${var.db_password}@${module.database.fqdn}:5432/shipmenthub"
  sensitive   = true
}
