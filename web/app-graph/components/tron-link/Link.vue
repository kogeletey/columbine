<template>
  <WalletProvider
    :adapters="adapters"
    @connect="onConnect"
    @disconnect="onDisconnect"
  >
    <WalletModalProvider>
      <WalletActionButton>  </WalletActionButton>
    </WalletModalProvider>
  </WalletProvider>
</template>
<script setup lang="ts">
import { WalletProvider } from "@tronweb3/tronwallet-adapter-vue-hooks";
import {
  TronLinkAdapter,
  // WalletConnectAdapter,
} from "@tronweb3/tronwallet-adapters";
import {
  WalletModalProvider,
  WalletActionButton,
} from "@tronweb3/tronwallet-adapter-vue-ui";
import { useTronWalletStore } from "@/stores/profile";
import "./tron-link.css";

const tronLink = new TronLinkAdapter();
const adapters = [tronLink];

const profileStore = useTronWalletStore()

function onConnect(address: string) {
  profileStore.addProfileAddress(address)
  // console.log("[wallet hooks] onConnect: ", address);
}

function onDisconnect() {
  profileStore.removeProfiles()
}
</script>

<style scoped>
:deep(.adapter-vue-button) {
  background-color: var(--background);
  color: var(--foreground);
}
</style>
