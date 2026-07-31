# Creates the Private DNS Zone for the database
resource "azurerm_private_dns_zone" "db_dns" {
  name                = "shipment.postgres.database.azure.com"
  resource_group_name = var.resource_group_name
}

# links the DNS Zone to your Virtual Network so your App VM can resolve the DB URL
resource "azurerm_private_dns_zone_virtual_network_link" "db_dns_link" {
  name                  = "db-dns-vnet-link"
  private_dns_zone_name = azurerm_private_dns_zone.db_dns.name
  virtual_network_id    = var.vnet_id
  resource_group_name   = var.resource_group_name
}

# provisions the fully private PostgreSQL Flexible Server
resource "azurerm_postgresql_flexible_server" "db" {
  name                   = var.db_server_name
  resource_group_name    = var.resource_group_name
  location               = var.location
  version                = "14"
  delegated_subnet_id    = var.db_subnet_id
  private_dns_zone_id    = azurerm_private_dns_zone.db_dns.id
  administrator_login    = var.db_admin_username
  administrator_password = var.db_admin_password
  
  zone                   = "1"
  storage_mb             = 32768
  sku_name               = "B_Standard_B1ms" 

  public_network_access_enabled = false


  depends_on = [azurerm_private_dns_zone_virtual_network_link.db_dns_link]
}

# Creates the actual database that goes  inside the PostgreSQL server
resource "azurerm_postgresql_flexible_server_database" "app_db" {
  name      = "shipmenthub"
  server_id = azurerm_postgresql_flexible_server.db.id
  collation = "en_US.utf8"
  charset   = "utf8"
}