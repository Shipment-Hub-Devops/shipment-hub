# the baston Host is the vm thats public where you can ssh into and then from there you can ssh into the app vm which is private. The bastion host is a jump box

resource "azurerm_network_interface" "bastion_nic" {
  name                = "bastion-nic"
  location            = var.location
  resource_group_name = var.resource_group_name

  ip_configuration {
    name                          = "internal"
    subnet_id                     = var.bastion_subnet_id
    private_ip_address_allocation = "Dynamic"
    public_ip_address_id          = var.bastion_public_ip_id # Public IP attached here
  }
}

resource "azurerm_network_interface_security_group_association" "bastion_nsg_assoc" {
  network_interface_id      = azurerm_network_interface.bastion_nic.id
  network_security_group_id = var.bastion_nsg_id
}

resource "azurerm_linux_virtual_machine" "bastion_vm" {
  name                  = "bastion-vm"
  location              = var.location
  resource_group_name   = var.resource_group_name
  size                  = "Standard_D2s_v4"
  network_interface_ids = [azurerm_network_interface.bastion_nic.id]
  admin_username        = var.admin_username

  admin_ssh_key {
    username   = var.admin_username
    public_key = var.ssh_public_key
  }

  os_disk {
    caching              = "ReadWrite"
    storage_account_type = "Standard_LRS"
  }

  source_image_reference {
    publisher = "Canonical"
    offer     = "0001-com-ubuntu-server-jammy"
    sku       = "22_04-lts-gen2"
    version   = "latest"
  }
}

# The app's VM is private and you can only access it via the Bastion Host. It does not have a public IP.

resource "azurerm_network_interface" "app_nic" {
  name                = "app-nic"
  location            = var.location
  resource_group_name = var.resource_group_name

  ip_configuration {
    name                          = "internal"
    subnet_id                     = var.app_subnet_id
    private_ip_address_allocation = "Dynamic"
    # Notice: NO public IP is attached here. It is completely private.
  }
}

resource "azurerm_network_interface_security_group_association" "app_nsg_assoc" {
  network_interface_id      = azurerm_network_interface.app_nic.id
  network_security_group_id = var.app_nsg_id
}

resource "azurerm_linux_virtual_machine" "app_vm" {
  name                  = "shipment-hub-vm"
  location              = var.location
  resource_group_name   = var.resource_group_name
  size                  = var.app_vm_size
  network_interface_ids = [azurerm_network_interface.app_nic.id]
  admin_username        = var.admin_username

  admin_ssh_key {
    username   = var.admin_username
    public_key = var.ssh_public_key
  }

  os_disk {
    caching              = "ReadWrite"
    storage_account_type = "Standard_LRS"
  }

  source_image_reference {
    publisher = "Canonical"
    offer     = "0001-com-ubuntu-server-jammy"
    sku       = "22_04-lts-gen2"
    version   = "latest"
  }
}