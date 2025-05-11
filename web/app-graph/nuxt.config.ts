import process from 'node:process'
import { fileURLToPath } from 'node:url'
import Inspect from 'vite-plugin-inspect'

const NUXT_DEBUG_BUILD = !!import.meta.env.NUXT_DEBUG_BUILD

export default defineNuxtConfig({
    ssr: false,

    modules: [
        '@vueuse/nuxt',
        '@unocss/nuxt',
        '@nuxt/eslint',
        'nuxt-eslint-auto-explicit-import',
        'nuxt-mcp',
        '@pinia/nuxt',
    ],

    logLevel: 'verbose',
    srcDir: '.',

    eslint: {
        config: {
            standalone: false,
        },
    },

    experimental: {
        typedPages: true,
        clientNodeCompat: true,
    },

    features: {
        inlineStyles: false,
    },

    css: [
        '@unocss/reset/tailwind.css',
    ],

    nitro: {
        minify: NUXT_DEBUG_BUILD ? false : undefined,
        preset: 'static',
        output: {
            dir: '../dist',
        },
        routeRules: {
            '/': {
                prerender: true,
            },
            '/200.html': {
                prerender: true,
            },
            '/404.html': {
                prerender: true,
            },
            '/**': {
                prerender: false,
            },
        },
        sourceMap: false,
    },

    app: {
        baseURL: './',
        head: {
            title: 'Node Modules Inspector',
            charset: 'utf-8',
            viewport: 'width=device-width,initial-scale=1',
            meta: [
                { name: 'description', content: 'Visualize your node_modules, inspect dependencies, and more.' },
            ],
            link: [
                { rel: 'icon', type: 'image/svg+xml', href: `/favicon.svg` },
            ],
            htmlAttrs: {
                lang: 'en',
                class: 'bg-dots',
            },
        },
    },

    vite: {
        base: './',
        define: {
            // 'import.meta.env.BACKEND': JSON.stringify(backend),
        },
        server: {
        },
        build: {
            minify: NUXT_DEBUG_BUILD ? false : undefined,
            rollupOptions: {
                output: {
                    entryFileNames: '_nuxt/[name].[hash].js',
                    chunkFileNames: '_nuxt/chunks/[name].[hash].js',
                },
            },
        },
        optimizeDeps: {
            include: [
                'fuse.js',
                'd3-hierarchy',
                'd3-shape',
                'modern-screenshot',
            ],
            exclude: [
                'structured-clone-es',
                'birpc',
            ],
        },
        plugins: [
            NUXT_DEBUG_BUILD ? Inspect({ build: true }) : null,
        ],
    },

    devtools: {
        enabled: false,
    },

    typescript: {
        includeWorkspace: true,
    },

    hooks: {
        'prepare:types': function ({ tsConfig }) {
            const aliasesToRemoveFromAutocomplete = ['~~', '~~/*', '~', '~/*']
            for (const alias of aliasesToRemoveFromAutocomplete) {
                if (tsConfig.compilerOptions?.paths[alias]) {
                    delete tsConfig.compilerOptions.paths[alias]
                }
            }
        },
    },

    compatibilityDate: '2024-07-17',
})
