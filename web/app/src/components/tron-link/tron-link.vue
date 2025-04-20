<template>
  <WalletProvider
    :adapters="adapters"
    @connect="onConnect"
    @disconnect="onDisconnect"
  >
    <WalletModalProvider>
      <WalletActionButton> Connect </WalletActionButton>
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
import { ProfileStore } from "@/stores/profile.ts";
import "./tron-link.css";

const tronLink = new TronLinkAdapter();
const adapters = [tronLink];

const profileStore = new ProfileStore()

function onConnect(address: string) {
  profileStore.addProfileAddress(address)
  // console.log("[wallet hooks] onConnect: ", address);
}

function onDisconnect() {
  profileStore.removeProfile()
}
</script>

<style scoped>
:deep(.adapter-vue-button) {
  background-color: var(--background);
  color: var(--foreground);
}
</style>
