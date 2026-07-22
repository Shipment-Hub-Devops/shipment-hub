# Compute module — jumpbox (public subnet) + app VM (private subnet)

variable "location" { type = string }
variable "resource_group_name" { type = string }
variable "vm_size" { type = string }
variable "user_admin" { type = string }
variable "ssh_public_key_path" { type = string }
variable "public_subnet_id" { type = string }
variable "private_subnet_id" { type = string }
variable "app_private_ip" { type = string }
variable "app_port" { type = number }

# ---------------------------------------------------------------
# Jumpbox — public entry point. Also forwards the app port to the
# private app VM so the application is publicly reachable through
# the jumpbox's IP (allowed by the assignment as the budget option).
# ---------------------------------------------------------------
resource "azurerm_public_ip" "jumpbox" {
  name                = "jumpbox-pip"
  location            = var.location
  resource_group_name = var.resource_group_name
  allocation_method   = "Static"
  sku                 = "Standard"
}

resource "azurerm_network_interface" "jumpbox" {
  name                = "jumpbox-nic"
  location            = var.location
  resource_group_name = var.resource_group_name

  ip_configuration {
    name                          = "internal"
    subnet_id                     = var.public_subnet_id
    private_ip_address_allocation = "Dynamic"
    public_ip_address_id          = azurerm_public_ip.jumpbox.id
  }
}

resource "azurerm_linux_virtual_machine" "jumpbox" {
  name                  = "jumpbox-vm"
  location              = var.location
  resource_group_name   = var.resource_group_name
  size                  = var.vm_size
  network_interface_ids = [azurerm_network_interface.jumpbox.id]
  admin_username        = var.user_admin

  admin_ssh_key {
    username   = var.user_admin
    public_key = file(var.ssh_public_key_path)
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

  # Forward the app port to the private app VM (iptables DNAT),
  # persisted across reboots via iptables-persistent.
  custom_data = base64encode(<<-CLOUDINIT
    #cloud-config
    package_update: true
    packages:
      - iptables-persistent
    runcmd:
      - sysctl -w net.ipv4.ip_forward=1
      - echo 'net.ipv4.ip_forward=1' > /etc/sysctl.d/99-forward.conf
      - iptables -t nat -A PREROUTING -p tcp --dport ${var.app_port} -j DNAT --to-destination ${var.app_private_ip}:${var.app_port}
      - iptables -t nat -A POSTROUTING -j MASQUERADE
      - netfilter-persistent save
    CLOUDINIT
  )
}

# ---------------------------------------------------------------
# Application VM — private subnet, static private IP, no public IP
# ---------------------------------------------------------------
resource "azurerm_network_interface" "app" {
  name                = "app-nic"
  location            = var.location
  resource_group_name = var.resource_group_name

  ip_configuration {
    name                          = "internal"
    subnet_id                     = var.private_subnet_id
    private_ip_address_allocation = "Static"
    private_ip_address            = var.app_private_ip
  }
}

resource "azurerm_linux_virtual_machine" "app" {
  name                  = "shipment-hub-vm"
  location              = var.location
  resource_group_name   = var.resource_group_name
  size                  = var.vm_size
  network_interface_ids = [azurerm_network_interface.app.id]
  admin_username        = var.user_admin

  admin_ssh_key {
    username   = var.user_admin
    public_key = file(var.ssh_public_key_path)
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

output "jumpbox_public_ip" { value = azurerm_public_ip.jumpbox.ip_address }
output "app_vm_private_ip" { value = azurerm_network_interface.app.private_ip_address }
