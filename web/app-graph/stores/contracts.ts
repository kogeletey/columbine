import { defineStore } from 'pinia'
import fetchWithDomain from '@/utils/fetch-with-domain'
import { useStorage } from '@vueuse/core'

export const useContractsStore = defineStore('contract', {
    state: () => ({
        _contractAddress: '',
        _tokenInformation: {},
        _tokenInformationStorage: {}
    }),
    getters: {
        getTokenAddress: state => state._contractAddress,
        getTokenInformation: state => state._tokenInformation
    },
    actions: {
        async fetchTokenInformation(address: string) {
            const fromStorage = localStorage.getItem('token-information')
            console.log('get-information-from-storage', fromStorage)
            if (fromStorage && fromStorage?.contractAddress === address) {
                this.setResultInformation(fromStorage)
                return fromStorage
            } else {
                const result = await fetchWithDomain(`/api/v1/tronscan/${address}`)
                this.setResultInformation(result)
                this._contractAddress = result.contractAddress;
                return result;
            }
        },
        setResultInformation(result) {
            this._tokenInformation = result
            useStorage('token-information',this._tokenInformation,localStorage)
        }
    }
})
