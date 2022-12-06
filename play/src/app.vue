<template>
  <router-view></router-view>
</template>

<script setup lang="ts">
import Cookies from 'universal-cookie'
import { onMounted } from 'vue'

const cookies = new Cookies()

onMounted(async () => {
  const res = await fetch('https://enocloudd.enoch-car.com/enocloud/sso/security/user', { credentials: 'include' }).then((res) => res.json())
  if (res.data) {
    const user = res.data[0]
    const { token, tenant, branch, ssoUserId } = user

    cookies.set('SSO_USER_ID', ssoUserId)
    cookies.set('SSO_TOKEN', token)
    cookies.set('ENOCH_TENANT', tenant?.id)
    cookies.set('ENOCH_BRANCH', branch?.id)
  }
})
</script>
