output "bastion_nsg_id" {
  value = azurerm_network_security_group.bastion_nsg.id
}

output "app_nsg_id" {
  value = azurerm_network_security_group.app_nsg.id
}