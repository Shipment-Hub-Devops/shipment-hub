# the security group for the Bastion Host
resource "azurerm_network_security_group" "bastion_nsg" {
  name                = "bastion-nsg"
  location            = var.location
  resource_group_name = var.resource_group_name

  # SSH into the bastion.
  #
  # ACCEPTED RISK: the source is the internet rather than a single address.
  # The CD pipeline deploys from GitHub-hosted runners, which draw an
  # unpredictable address from a large pool on every run, so a fixed
  # allow-list cannot admit them. Pinning it to one operator's home address
  # also locked out teammates and broke whenever that address rotated.
  #
  # Compensating controls, applied by ansible/playbook.yml:
  #   - PasswordAuthentication no  (key-only; password guessing is impossible)
  #   - PermitRootLogin no
  #   - MaxAuthTries 3
  # The app VM stays unreachable from here — only the bastion is exposed.
  # See SECURITY.md for the full rationale.
  security_rule {
    name                       = "Allow-SSH-From-Internet"
    priority                   = 100
    direction                  = "Inbound"
    access                     = "Allow"
    protocol                   = "Tcp"
    source_port_range          = "*"
    destination_port_range     = "22"
    source_address_prefix      = "Internet"
    destination_address_prefix = "*"
  }

  # Public HTTP entry point for the application.
  # The app VM has no public IP, so nginx on this host (ansible/jumpbox.yml)
  # reverse-proxies port 80 to the app VM on 4000. Without this rule the
  # application is not reachable from the internet at all.
  security_rule {
    name                       = "Allow-HTTP-From-Internet"
    priority                   = 110
    direction                  = "Inbound"
    access                     = "Allow"
    protocol                   = "Tcp"
    source_port_range          = "*"
    destination_port_range     = "80"
    source_address_prefix      = "Internet"
    destination_address_prefix = "*"
  }
}

# the security group for the App VM
resource "azurerm_network_security_group" "app_nsg" {
  name                = "app-nsg"
  location            = var.location
  resource_group_name = var.resource_group_name

  # Only allows the  SSH if the traffic originates from the Bastion Subnet
  security_rule {
    name                       = "Allow-SSH-From-Bastion"
    priority                   = 100
    direction                  = "Inbound"
    access                     = "Allow"
    protocol                   = "Tcp"
    source_port_range          = "*"
    destination_port_range     = "22"
    source_address_prefix      = var.bastion_subnet_prefix
    destination_address_prefix = "*"
  }

  # sets the Node application traffic to Port 4000
  security_rule {
    name                       = "Allow-Node-Traffic"
    priority                   = 110
    direction                  = "Inbound"
    access                     = "Allow"
    protocol                   = "Tcp"
    source_port_range          = "*"
    destination_port_range     = "4000"
    source_address_prefix      = "VirtualNetwork"
    destination_address_prefix = "*"
  }

  # Next.js frontend. Same posture as the API above: reachable only from inside
  # the VNet, because the bastion's nginx is what serves it to the internet.
  security_rule {
    name                       = "Allow-Frontend-Traffic"
    priority                   = 120
    direction                  = "Inbound"
    access                     = "Allow"
    protocol                   = "Tcp"
    source_port_range          = "*"
    destination_port_range     = "3000"
    source_address_prefix      = "VirtualNetwork"
    destination_address_prefix = "*"
  }
}