<script setup lang="ts">
import { useRoute } from "#app/composables/router";
import { computed } from "vue";
import { isSidepanelCollapsed } from "../state/ui";

import { useContractsStore } from "#imports";

const contractsStore = useContractsStore();

const route = useRoute()

const params = route.params as Record<string, string>;
const selected = computed(() => params.report[0] || "all");

const state = reactive({
    getTokenAddress: computed(() => contractsStore.getTokenAddress),
    tokenInfo: computed(() => contractsStore.getTokenInformation),
});

const router = useRouter()

function formatNumberWithCommas(n, locale = "en") {
  return Number(n).toLocaleString(locale);
}

onMounted(async () => {
    if (selected.value === 'all') {
        router.replace({ path: `/`, hash: location.hash, query: route.query})
    }
    await contractsStore.fetchTokenInformation(selected.value);
});
</script>

<template>
    <main transition-all duration-300 :class="[
        {
            'transition-none!': $route.meta.noOffset,
        },
        'report-page',
    ]" grid="~ cols-2 gap-2">
        <section h-full grid="~ place-items-center place-content-center" border>
                <div class="report-page__basic">
                    <picture>
                        <figure>
                            <img :src="state.tokenInfo.logo" />
                        </figure>
                    </picture>
                    <h3>
                        {{ state.tokenInfo?.name }}
                    </h3>
                    <a :href="state.tokenInfo.projectPage">
                        Project Page
                        <div i-ph-arrow-circle-up-right-duotone></div>
                    </a>
                </div>
            <div class="report-page__cap">
                <span class="report-page__info" v-if="state.tokenInfo.marketCap"> MarketCap: {{ formatNumberWithCommas(state.tokenInfo.marketCap) }} $ </span>
                <span class="report-page__info" v-if="state.tokenInfo.liquidity"> Total Liquids: {{ formatNumberWithCommas(state.tokenInfo.liquidity) }} $ </span>
                <span class="report-page__info" v-if="state.tokenInfo.totalSupply"> Total Supply: {{ formatNumberWithCommas(state.tokenInfo.totalSupply) }} $ </span>
            </div>
        </section>
        <section class="report-page__price">
            <h3> Price: </h3>
            <DisplayTrading :address="state.getTokenAddress" />
        </section>
    </main>
</template>

<style lang="css" scoped>
.report-page {
    padding: 10px;
    padding-top: 100px;
    min-height: 100vh;
}

.report-page__info {
    display: flex;
    font-size: 18px;
}

.report-page__cap {
}

.report-page__basic {
   display: grid;
   grid-template-areas: 'a b'
    'a c';
    gap: 15px;
  & picture {
    grid-area: a;
    }
  & h3 {
        font-weight: bold;
        font-size: 20px;
    }
  & a:hover {
        --un-text-opacity: 1;
  color: rgb(87 158 75 / var(--un-text-opacity));
    }
}
</style>
