output "vnet_id" {
  value = azurerm_virtual_network.vnet.id
}

output "bastion_subnet_id" {
  value = azurerm_subnet.bastion_subnet.id
}

output "app_subnet_id" {
  value = azurerm_subnet.app_subnet.id
}

output "db_subnet_id" {
  value = azurerm_subnet.db_subnet.id
}

output "bastion_public_ip_id" {
  value = azurerm_public_ip.bastion_pip.id
}

output "bastion_public_ip_address" {
  value = azurerm_public_ip.bastion_pip.ip_address
}