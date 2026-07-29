# Azure Shipment Hub - Terraform Infrastructure

This repository contains the Terraform configuration used to provision the infrastructure for Shipment Hub on Microsoft Azure. The setup creates a secure networking environment with an Ubuntu virtual machine that serves as the deployment server for the application.

## Infrastructure Overview

The Terraform configuration creates the following resources:

- A resource group called `azure-shipment` that contains all the infrastructure resources.
- A virtual network (`vnet`) with the address space `10.0.0.0/16` into 3 isolated subnets
   - Bastion subnet (10.0.1.0/24) for the secure entry point
   - App subnet (10.0.2.0/24) for the private application workload
   - Database subnet (10.0.3.0/24) for secure database placement 
- Network Security Groups enforcing strict zero-trust boundaries:
   - Bastion NSG allowing inbound SSH access on port 22 restricted to your specific IP
   - App NSG permitting internal traffic and application ports exclusively through the bastion layer 
- A hardened Linux Bastion Virtual Machine (bastion-vm) with a static Standard SKU Public IP (Standard_D2s_v4) acting as a secure jump box
- An Azure Managed PostgreSQL Flexible Server (shipment-hub-pg-db001) integrated via a Private DNS Zone (shipment.postgres.database.azure.com)
- An Azure Container Registry (azureshipmentacrdev001) for container image management
- SSH key-based authentication using `~/.ssh/id_rsa.pub`.

## Configuration Variables

The project uses the dev.tfvars which holds the  following variables:

- `location` – Azure region where the resources are deployed. The default value is `uaenorth`.
- `user_admin` – The administrator username used to connect to the VM. The default value is `azureadmin`.
- `name_of_rg` – The name of the resource group. The default value is `azure-shipment`.
- `my_public_ip` – Your local public IPv4 address restricted for Bastion SSH access 

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

## Resource Provider Registration

If you are using a fresh Azure subscription, you must have to  register the required resource providers before running Terraform:

```bash
az provider register --namespace Microsoft.Compute
az provider register --namespace Microsoft.Network
az provider register --namespace Microsoft.Storage
```

## Deployment

Navigate to the Terraform project directory.

```bash
cd terraform
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

After the deployment completes, Terraform outputs the connection details for your environment.

Because the main application VM sits securely in a private subnet, you access it by tunneling through your Bastion host using an SSH ProxyJump:

```bash
ssh -J azureadmin@<bastion_public_ip> azureadmin@<app_vm_private_ip>
```

## Issues I Faced

- I could not deploy to the VM due to regional constraints on servers based off my student subscription, Eddie found a solution whereby we changed the provider version for azure to a more a recent one than the one I had initially chose which was the latest version
- When I was creating the VM for the Baston Host, i had to use a vm size within the same region and that also had the same quota due to my student subscription constraint 
- Also if you are using the subscription for the first time it requires extra steps to register your resource providers in your azure account 
- While testing different configurations using test apply my CLI would freeze/hang while trying to destroy outdated resources when i directly ran terraform apply so I instead used the azure cli directly to delete old group resources and also cleared the local state file to speed up the process
- When working with local state and rapid testing, network routing mismatches between IPv6 address resolution and Azure's IPv4-only Network Security Group source rules caused initial SSH timeout errors, which were resolved by binding the allowed IP configuration strictly to IPv4.

## Helpful Resources for me 
- https://learn.microsoft.com/en-us/azure/architecture/ 
- https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs
- https://developer.hashicorp.com/terraform/tutorials

- This basically helped me when i had to upgrade the terraform to be modular and to have better security like Baston 