output "app_vm_private_ip" {
  description = "The private IP address of the app's  virtual machine"
  value       = azurerm_linux_virtual_machine.app_vm.private_ip_address
}