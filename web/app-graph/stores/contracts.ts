import { defineStore } from 'pinia'
import fetchWithDomain from '@/utils/fetch-with-domain'
import { useStorage } from '@vueuse/core'

export const useContractsStore = defineStore('contract', {
    state: () => ({
        _contractAddress: '',
        _tokenInformation: {},
        _tokenInformationStorage: {},
        _transactionInformation: {}
    }),
    getters: {
        getTokenAddress: state => state._contractAddress,
        getTokenInformation: state => state._tokenInformation
    },
    actions: {
        async fetchTokenInformation(address: string) {
            const fromStorageStringify = localStorage.getItem('token-information')
            const fromStorage = JSON.parse(fromStorageStringify || '{}')
            if (fromStorage && fromStorage?.contractAddress === address) {
                this.setResultInformation(fromStorage)
                this._contractAddress = address;
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
        },
        async fetchTranscationGraph(address: string) {
            const result = await fetchWithDomain(`/api/v1/tronscan/${address}`)
            this.setTransactionResult(result)
            return result;
         },
        setTransactionResult(result) {
            this._transactionInformation = result
        }
    }
})
