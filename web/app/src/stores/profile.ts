import { map } from "nanostores"

export type ProfileValue = {
    address?: string
}

export class ProfileStore {
    static $profiles = map<ProfileValue>()

    addProfileAddress(address: string) {
        ProfileStore.$profiles.setKey("address", address)
    }

    removeProfile() {
        ProfileStore.$profiles.setKey("address", undefined)
    }
}
