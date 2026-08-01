# Create the main Resource Group for all modules
resource "azurerm_resource_group" "rg" {
  name     = var.name_of_rg
  location = var.location
}

module "network" {
  source              = "./modules/network"
  resource_group_name = azurerm_resource_group.rg.name
  location            = azurerm_resource_group.rg.location
}

module "security" {
  source                = "./modules/security"
  resource_group_name   = azurerm_resource_group.rg.name
  location              = azurerm_resource_group.rg.location
  my_public_ip          = var.my_public_ip
  bastion_subnet_prefix = "10.0.1.0/24"
}

module "compute" {
  source               = "./modules/compute"
  resource_group_name  = azurerm_resource_group.rg.name
  location             = azurerm_resource_group.rg.location
  
  # Injecting network and security IDs outputted by the other modules
  bastion_subnet_id    = module.network.bastion_subnet_id
  app_subnet_id        = module.network.app_subnet_id
  bastion_public_ip_id = module.network.bastion_public_ip_id
  bastion_nsg_id       = module.security.bastion_nsg_id
  app_nsg_id           = module.security.app_nsg_id
  
  # Compute specific variables
  ssh_public_key       = file(var.ssh_public_key_path)
  admin_username       = var.user_admin
}

module "registry" {
  source              = "./modules/registry"
  resource_group_name = azurerm_resource_group.rg.name
  location            = azurerm_resource_group.rg.location
  registry_name       = var.registry_name
}

module "database" {
  source              = "./modules/database"
  resource_group_name = azurerm_resource_group.rg.name
  location            = azurerm_resource_group.rg.location
  vnet_id             = module.network.vnet_id
  db_subnet_id        = module.network.db_subnet_id
  db_server_name      = var.db_server_name
  db_admin_password   = var.db_admin_password
}