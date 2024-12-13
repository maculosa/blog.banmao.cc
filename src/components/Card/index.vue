<template>
  <div class="card flex-col gap-4 bg-#fff mb-4 rounded-4 shadow p-4">
    <div class="flex justify-between items-center pb-2 b-b-gray-200 b-b-1">
      <h5 class="font-bold text-#333">{{ title }}</h5>

      <slot name="header-extra" />
    </div>
    <div class="mt-4">
      <slot></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue'

  interface CardProps {
    title: string
    width?: number
  }

  const props = defineProps<CardProps>()

  const width = computed(() => {
    if (props.width) {
      return `${props.width}px`
    } 
    return '100%'
  })
</script>

<style scoped>
  .card {
    width: v-bind(width);
  }
</style>
