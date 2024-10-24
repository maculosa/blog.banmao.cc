<template>
    <input
            class="w-100% box-border h-32px px-4 border-1 rounded-1"
            type="number"
            id="total"
            v-model="model"
            :placeholder="props.placeholder"
          />
</template>

<script lang="ts" setup>

defineOptions({
    name: 'BInput'
})

const model = defineModel()

interface InputProps {
    placeholder?: string
}

const props = defineProps<InputProps>()
</script>
