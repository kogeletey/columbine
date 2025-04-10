<template>
  <WalletProvider
    :adapters="adapters"
    @connect="onConnect"
    @disconnect="onDisconnect"
  >
    <WalletModalProvider>
      <WalletActionButton> </WalletActionButton>
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
import "./tron-link.css";

const tronLink = new TronLinkAdapter();
const adapters = [tronLink];

function onConnect(address: string) {
  console.log("[wallet hooks] onConnect: ", address);
}

function onDisconnect() {
  console.log("[wallet hooks] onDisconnect");
}
</script>

<style scoped>
:deep(.adapter-vue-button) {
  background-color: var(--background);
  color: var(--foreground);
}
</style>
