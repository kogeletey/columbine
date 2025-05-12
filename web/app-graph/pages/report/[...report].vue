<script setup lang="ts">
import { useRoute } from "#app/composables/router";
import { computed } from "vue";
import { isSidepanelCollapsed } from "../state/ui";

import { useContractsStore } from "#imports";

const contractsStore = useContractsStore();

const params = useRoute().params as Record<string, string>;
const selected = computed(() => params.report[0] || "all");

const state = reactive({
    getTokenAddress: computed(() => contractsStore.getTokenAddress),
    tokenInfo: computed(() => contractsStore.getTokenInformation),
});

onMounted(async () => {
        await contractsStore.fetchTokenInformation(selected.value);
});
</script>

<template>
    <main transition-all duration-300 :class="[
        {
            'transition-none!': $route.meta.noOffset,
        },
        'report-page',
    ]" grid="~ cols-2">
        <section h-full grid="~ place-items-center">
                <div>
                    <picture>
                        <figure>
                            <img :src="state.tokenInfo.logo" />
                        </figure>
                    </picture>
                    <h3>
                        {{ state.tokenInfo?.name }}
                    </h3>
                    <a :href="state.tokenInfo.projectPage"> Project Page </a>
                </div>
            <div>
                <span class="report-page__info"> MarketCap: {{ state.tokenInfo.marketCap }} </span>
                <span class="report-page__info"> Total Liquids: {{ state.tokenInfo.liqudity }} </span>
                <span class="report-page__info"> Total Supply: {{ state.tokenInfo.totalSupply }} </span>
            </div>
        </section>
        <DisplayTrading :address="state.getTokenAddress" />
    </main>
</template>

<style lang="css" scoped>
.report-page {
    padding: 10px;
    padding-top: 100px;
    min-height: 100vh;
}

.report-page__info {

}
</style>
