<template>
  <fieldset>
    <legend>defineFactory</legend>

    <div>
      <h1>{{ form.data.index }}</h1>
      <button @click="form.add.click" class="bg-blue px-20 py-2">+</button>
    </div>
  </fieldset>
</template>

<script lang="ts">
import { factory } from '@enochfe/factory'

export default factory({
  children: {
    form: {
      data: {
        index: 0
      },
      children: {
        add: {
          click() {
            console.log(this)
            // this.form.data.index++
          }
        }
      }
    }
  }
})
</script>
