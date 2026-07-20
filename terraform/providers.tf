terraform {
  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "4.50.0"
    }
  }
}

provider "azurerm" {
  features {}
}

# I got the boilerplate code for the provider config from this website: https://registry.terraform.io/providers/hashicorp/azurerm/latest
# Also i chose for azure since this is the cloud provider that we all signed up for in class and is free tiered 
