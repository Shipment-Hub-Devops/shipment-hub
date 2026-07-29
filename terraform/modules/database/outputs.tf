output "db_server_fqdn" {
  description = "The qualified domain name of the PostgreSQL server"
  value       = azurerm_postgresql_flexible_server.db.fqdn
}

output "db_name" {
  description = "The name of the database created for the app"
  value       = azurerm_postgresql_flexible_server_database.app_db.name
}