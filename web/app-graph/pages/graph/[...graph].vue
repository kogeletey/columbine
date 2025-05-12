<script setup lang="ts">
import { isSidepanelCollapsed } from "../state/ui";
import { reactive } from 'vue'
import type { PackageNode } from "@/types/node";
import { useContractsStore } from "#imports";
import { useRoute } from "#app/composables/router";

const state = reactive({
    rootPackages: [] as PackageNode[],
    payload: {}
})

const route = useRoute()
const selected = computed(() => params.graph[0] || "all");

const params = route.params as Record<string, string>;

const contractStore = useContractsStore()

const router = useRouter()

// Your input JSON
const inputData = {
    "analysis": {
        "type": "SMART_CONTRACT",
        "mainContract": "TXF1xDbVGdxFGbovmmmXvBGu8ZiE3Lq4mR",
        "callHierarchy": {
            "5ae025495dee7e9ba694fd71fb8bd6b2621cec4e149345ff56e369990e8c7cf5": {
                "hash": "5ae025495dee7e9ba694fd71fb8bd6b2621cec4e149345ff56e369990e8c7cf5",
                "caller": "TXF1xDbVGdxFGbovmmmXvBGu8ZiE3Lq4mR",
                "callee": "TLkhSBpYbgQ4A7nEUaC4cYXmhiZjuks9oX",
                "note": "call",
                "value": 0,
                "children": [
                    {
                        "hash": "36342e5ba1991b441404af98acd41a3c335e483ac3820ac0c6f86090b2d9bcae",
                        "caller": "TLkhSBpYbgQ4A7nEUaC4cYXmhiZjuks9oX",
                        "callee": "TDxL4V5LE6TYSFXSCWJkkSsCYbgmrDnTer",
                        "note": "call",
                        "value": 0,
                        "children": []
                    },
                    {
                        "hash": "34945191fa3ed2587d1384769507094f824e2c05ba5f03fea9a37fea2622083d",
                        "caller": "TLkhSBpYbgQ4A7nEUaC4cYXmhiZjuks9oX",
                        "callee": "TDxL4V5LE6TYSFXSCWJkkSsCYbgmrDnTer",
                        "note": "call",
                        "value": 0,
                        "children": []
                    },
                    {
                        "hash": "fae2fecf8f4a447ee78a069e03cb696ff8b13d7079152205760bf691ecb4858e",
                        "caller": "TLkhSBpYbgQ4A7nEUaC4cYXmhiZjuks9oX",
                        "callee": "TNUC9Qb1rRpS5CbWLmNMxXBjyFoydXjWFR",
                        "note": "call",
                        "value": 0,
                        "children": undefined // <--- we now handle this
                    }
                ]
            }
        }
    }
};



function shortenHash(hash, length = 8) {
    return hash ? hash.slice(0, length) : 'unknown';
}

function generateContractDependencyGraph(data) {
    const nodes = new Map(); // map from shortened address -> node
    const visited = new Set(); // prevent cycles in call hierarchy

    if (!data || typeof data !== 'object') {
        console.warn('Invalid analysis data passed');
        return [];
    }

    const mainContractAddress = data.mainContract;
    const callHierarchy = data.callHierarchy;

    function createNode(address, depth = 0) {
        const shortAddr = shortenHash(address);
        if (nodes.has(shortAddr)) return nodes.get(shortAddr);

        const node = {
            name: shortAddr,
            version: '1.0.0',
            spec: `${shortAddr}@1.0.0`,
            dependents: new Set(),
            dependencies: new Set(),
            depth,
            flatDependents: new Set([shortAddr]),
            resolved: {
                module: '',
                packageJson: {
                    name: shortAddr,
                    version: '1.0.0',
                    dependencies: {}
                }
            }
        };

        nodes.set(shortAddr, node);
        return node;
    }

    function walk(call, callerNode, depth) {
        if (!call || !call.hash || visited.has(call.hash)) return;
        visited.add(call.hash);

        const callerShort = shortenHash(call.caller);
        const calleeShort = shortenHash(call.callee);

        let currentCallerNode = callerNode || createNode(callerShort, depth - 1);

        if (!currentCallerNode) {
            console.warn('Could not resolve caller node', callerShort);
            return;
        }

        // Create or get callee node
        let calleeNode = createNode(calleeShort, depth);

        // Add dependency relationship
        if (!currentCallerNode.dependencies.has(calleeShort)) {
            currentCallerNode.dependencies.add(calleeShort);
            calleeNode.dependents.add(currentCallerNode.name);

            // Update package.json
            currentCallerNode.resolved.packageJson.dependencies[calleeShort] = '^0.1.0';

            // Propagate flat dependents
            for (let dep of calleeNode.flatDependents) {
                currentCallerNode.flatDependents.add(dep);
            }
        }

        // Recurse into children safely
        if (Array.isArray(call.children)) {
            for (const child of call.children) {
                walk(child, calleeNode, depth + 1);
            }
        } else if (call.children && typeof call.children === 'object') {
            // If children is an object (e.g., nested hashes), convert to array
            const childArray = Object.values(call.children);
            for (const child of childArray) {
                walk(child, calleeNode, depth + 1);
            }
        }
    }

    // Start walking from first call in callHierarchy
    if (callHierarchy && typeof callHierarchy === 'object') {
        const calls = Object.values(callHierarchy);
        if (calls.length > 0 && calls[0]) {
            const rootCall = calls[0];
            walk(rootCall, null, 0);
        } else {
            console.warn('callHierarchy has no valid root call');
        }
    } else {
        console.warn('callHierarchy is missing or invalid');
    }

    // Convert Map to sorted array by depth
    return Array.from(nodes.values()).sort((a, b) => a.depth - b.depth);
}

const example = generateContractDependencyGraph(inputData.analysis);

const samplePayload = {
    packages: [
        example[0]
    ],
    dependencies: (node: PackageNode) => example,
    flatDependencies: () => example
}

onBeforeMount(async () => {
    if (selected.value === 'all') {
        router.replace({ path: `/`, hash: location.hash, query: route.query })
    }
    // const result = await contractStore.fetchTranscationGraph(selected.value)
    const packages = generateContractDependencyGraph(inputData.analysis)

    state.payload = {
        packages: [
            packages[0]
        ],
        dependencies: (node: PackageNode) => packages,
        flatDependencies: () => packages
    }

    state.rootPackages = [packages[0]]
})

</script>

<template>
    <div transition-all duration-300 :class="{
        'transition-none!': $route.meta.noOffset,
        'page-padding-collapsed': isSidepanelCollapsed,
    }">
        <GraphCanvas :payload="state.payload" :root-packages="state.rootPackages" />
    </div>
</template>
