import { defineStore } from 'pinia'

export const useTronWalletStore = defineStore('profile', {
    state: () => ({
        _address: ''
    }),
    actions: {
        addProfileAddress(address: string) {
            this._address = address
        },
        removeProfiles() {
            this._address = ''
        }
    }
})
