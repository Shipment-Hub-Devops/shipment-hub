# ShipmentHub — Summative infrastructure (modular)
# VM in a private subnet, jumpbox in a public subnet, managed PostgreSQL,
# private container registry (ACR), and NSGs.

resource "azurerm_resource_group" "rg" {
  name     = var.name_of_rg
  location = var.location
}

module "network" {
  source              = "./modules/network"
  location            = azurerm_resource_group.rg.location
  resource_group_name = azurerm_resource_group.rg.name
  app_port            = var.app_port
}

module "registry" {
  source              = "./modules/registry"
  location            = azurerm_resource_group.rg.location
  resource_group_name = azurerm_resource_group.rg.name
  acr_name            = var.acr_name
}

module "database" {
  source              = "./modules/database"
  location            = azurerm_resource_group.rg.location
  resource_group_name = azurerm_resource_group.rg.name
  db_subnet_id        = module.network.db_subnet_id
  vnet_id             = module.network.vnet_id
  db_admin            = var.db_admin
  db_password         = var.db_password
  db_sku              = var.db_sku
}

module "compute" {
  source              = "./modules/compute"
  location            = azurerm_resource_group.rg.location
  resource_group_name = azurerm_resource_group.rg.name
  vm_size             = var.vm_size
  user_admin          = var.user_admin
  ssh_public_key_path = var.ssh_public_key_path
  public_subnet_id    = module.network.public_subnet_id
  private_subnet_id   = module.network.private_subnet_id
  app_private_ip      = var.app_private_ip
  app_port            = var.app_port
}
