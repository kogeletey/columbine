import { defineStore } from 'pinia'
import fetchWithDomain from '@/utils/fetch-with-domain'

export const useTronWalletStore = defineStore('profile', {
    state: () => ({
        _address: ''
    }),
    actions: {
        async addProfileAddress(address: string) {
            await fetchWithDomain('/api/users', {
                method: 'POST',
                body: JSON.stringify({ name: 'User', walletAddress: address }),
            })
            this._address = address
        },
        async removeProfile(address: string) {
            const req = await fetchWithDomain('/api/users', {
                method: 'DELETE',
                body: JSON.stringify({ address })
            })
            this._address = ''
        },
    }
})
