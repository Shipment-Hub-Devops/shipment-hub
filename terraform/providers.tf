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

  # Pinned deliberately and with no default. The azurerm provider would
  # otherwise fall back to whichever subscription `az` happens to have
  # selected, which is easy to get wrong when the CLI is signed in to more
  # than one tenant — and the failure mode is creating real infrastructure
  # in the wrong subscription. Requiring it explicitly makes that impossible.
  subscription_id = var.subscription_id
}