<!-- <template>
  <fieldset>
    <legend>defineFactory</legend>

    <div>
      <h1>{{ factory.form.data.name }}</h1>
      <input :value="factory.form.data.name" type="text" @input="onInput" />
    </div>
  </fieldset>
</template> -->

<pung lang="json">
{
  "output": true,
  "name": "pung"
}
</pung>

<script setup lang="ts">
import { defineFactory } from '@enochfe/core'

interface IFormData {
  name: string
  age: number
}

defineFactory({
  children: {
    form: {
      data: {
        name: 'pung'
      } as IFormData,
      children: {
        name: {
          change() {}
        }
      }
    }
  }
})
</script>
