import { http } from '@/utils/http'

export const handleRequest = () => {
  const res = http({
    url: '/getUserList',
    method: 'GET',
  })
  console.log(res)
}
