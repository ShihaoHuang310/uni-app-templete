// src/store/user.ts
import { defineStore } from 'pinia'
import { ref } from 'vue'
// import { UserInfo } from '../typings'
interface UserInfo {
  name: string
  age: number
}

export const useUserStore = defineStore(
  'user',
  () => {
    const userInfo = ref<UserInfo>()

    const setUserInfo = (val: UserInfo) => {
      userInfo.value = val
    }

    const clearUserInfo = () => {
      userInfo.value = undefined
    }

    return {
      userInfo,
      setUserInfo,
      clearUserInfo,
    }
  },
  {
    persist: true,
  },
)
