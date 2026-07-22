# Database module — managed PostgreSQL flexible server with VNet integration

variable "location" { type = string }
variable "resource_group_name" { type = string }
variable "db_subnet_id" { type = string }
variable "vnet_id" { type = string }
variable "db_admin" { type = string }
variable "db_password" {
  type      = string
  sensitive = true
}
variable "db_sku" { type = string }

# Private DNS zone required for flexible-server VNet integration
resource "azurerm_private_dns_zone" "pg" {
  name                = "shipmenthub.postgres.database.azure.com"
  resource_group_name = var.resource_group_name
}

resource "azurerm_private_dns_zone_virtual_network_link" "pg" {
  name                  = "pg-dns-link"
  resource_group_name   = var.resource_group_name
  private_dns_zone_name = azurerm_private_dns_zone.pg.name
  virtual_network_id    = var.vnet_id
}

resource "azurerm_postgresql_flexible_server" "pg" {
  name                          = "shipmenthub-pg"
  location                      = var.location
  resource_group_name           = var.resource_group_name
  version                       = "16"
  administrator_login           = var.db_admin
  administrator_password        = var.db_password
  sku_name                      = var.db_sku
  storage_mb                    = 32768
  delegated_subnet_id           = var.db_subnet_id
  private_dns_zone_id           = azurerm_private_dns_zone.pg.id
  public_network_access_enabled = false

  depends_on = [azurerm_private_dns_zone_virtual_network_link.pg]
}

resource "azurerm_postgresql_flexible_server_database" "app" {
  name      = "shipmenthub"
  server_id = azurerm_postgresql_flexible_server.pg.id
  charset   = "UTF8"
  collation = "en_US.utf8"
}

output "fqdn" { value = azurerm_postgresql_flexible_server.pg.fqdn }
output "server_id" { value = azurerm_postgresql_flexible_server.pg.id }
