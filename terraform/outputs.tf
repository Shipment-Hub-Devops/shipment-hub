output "bastion_public_ip" {
  description = "Connect to this IP first using SSH"
  value       = module.network.bastion_public_ip_address
}

output "app_vm_private_ip" {
  description = "The internal IP of your App VM (SSH into this FROM the Bastion)"
  value       = module.compute.app_vm_private_ip
}

output "database_fqdn" {
  description = "The internal URL to connect your Node app to the database"
  value       = module.database.db_server_fqdn
}

output "registry_login_server" {
  description = "The URL for Docker to push/pull images"
  value       = module.registry.registry_login_server
}