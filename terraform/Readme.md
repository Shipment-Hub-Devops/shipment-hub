# Azure Shipment Hub - Terraform Infrastructure

This repository contains the Terraform configuration used to provision the infrastructure for Shipment Hub on Microsoft Azure. The setup creates a secure networking environment with an Ubuntu virtual machine that serves as the deployment server for the application.

## Infrastructure Overview

The Terraform configuration creates the following resources:

- A resource group called `azure-shipment` that contains all the infrastructure resources.
- A virtual network (`vnet`) with the address space `10.0.0.0/16`.
- A subnet (`subnet`) with the address range `10.0.1.0/24` where the virtual machine is deployed.
- A static Standard SKU public IP address that allows external access to the virtual machine.
- A network security group (`nsg`) that allows inbound traffic on:
  - Port `22` for SSH access.
  - Port `4000` for the deployed application.
- A network interface (`nic`) that connects the virtual machine to the subnet and the public IP.
- An Ubuntu Server 22.04 LTS virtual machine named `shipment-hub-vm`.
- SSH key-based authentication using `~/.ssh/id_rsa.pub`.

## Configuration Variables

The project uses the following variables:

- `location` – Azure region where the resources are deployed. The default value is `uaenorth`.
- `vm_size` – The virtual machine size. The default value is `Standard_D2_v4`.
- `user_admin` – The administrator username used to connect to the VM. The default value is `azureadmin`.
- `name_of_rg` – The name of the resource group. The default value is `azure-shipment`.

## Prerequisites

Before deploying the infrastructure, make sure you have:

- Terraform installed.
- An active Azure subscription.
- Azure CLI installed.
- Logged into Azure by running:

```bash
az login
```

- An SSH key pair available on your machine (`~/.ssh/id_rsa.pub`).

## Deployment

Navigate to the Terraform project directory.

```bash
cd path/to/your/terraform-files
```

Initialize Terraform.

```bash
terraform init
```

Review the execution plan.

```bash
terraform plan
```

Deploy the infrastructure.

```bash
terraform apply
```

When prompted, type:

```text
yes
```

to confirm the deployment.

## Outputs

After the deployment completes, Terraform returns the public IP address of the virtual machine.

You can use that IP address to connect to the server using:

```bash
ssh azureadmin@<vm_public_ip>
```

## Issues I Faced

- I could not deploy to the VM due to regional constraints on servers based off my student subscription, Eddie found a solution whereby we changed the provider version for azure to a more a recent one than the one I had initially chose which was the latest version
- Also if you are using the subscription for the first time it requires extra steps to register your resource providers in your azure account 
- While testing different configurations using test apply my CLI would freeze/hang while trying to destroy outdated resources when i directly ran terraform apply so I instead used the azure cli directly to delete old group resources and also cleared the local state file to speed up the process
- 
