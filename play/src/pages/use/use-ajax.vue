<template>
  <div></div>
</template>

<script setup lang="ts">
import Cookies from 'universal-cookie'
import { useAjax, fetch } from '@enochfe/use'

const cookies = new Cookies()

const res = await fetch<any>('https://enocloudd.enoch-car.com/enocloud/sso/security/user')

if (res.data[0]) {
  const user = res.data[0]
  const { token, tenant, branch, ssoUserId } = user
  cookies.set('SSO_USER_ID', ssoUserId)
  cookies.set('SSO_TOKEN', token)
  cookies.set('ENOCH_TENANT', tenant?.id)
  cookies.set('ENOCH_BRANCH', branch?.id)
}

const { data, run } = useAjax({ action: 'GET /test' })
</script>
