<template>
  <button
    type="button"
    class="text-14px transition cursor-pointer"
    :class="classNames"
    @click="onClick"
  >
    <slot></slot>
    <slot name="icon"></slot>
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue';


interface ButtonProps {
    block?: boolean
    type?: 'default' | 'primary' | 'danger' | 'success'
    size?: 'mini' | 'small' | 'medium' | 'large'
    border?: boolean
    rounded?: boolean
}

const props = withDefaults(defineProps<ButtonProps>(), {
    block: false,
    type: 'default',
    size: 'medium',
    border: true,
    rounded: true,
})

const classNames = computed(() => {
    return {
        'block': props.block,
        'w-100%': props.block,
        'bg-blue-600': props.type === 'primary',
        'hover:bg-blue-500': props.type === 'primary',
        'text-white': props.type === 'primary' || props.type === 'danger',
        'bg-red-400': props.type === 'danger',
        'hover:bg-red-300': props.type === 'danger',
        'bg-green-500': props.type === 'success',
        'hover:bg-green-400': props.type === 'success',
        'bg-white': props.type === 'default',
        'hover:bg-white': props.type === 'default',
        'py-1': props.size ==='mini',
        'py-4px': props.size ==='small',
        'py-8px': props.size ==='medium',
        'py-12px': props.size ==='large',
        'px-2': props.size ==='mini',
        'px-4px': props.size ==='small',
        'px-8px': props.size ==='medium',
        'px-12px': props.size ==='large',
        'border-1': props.border,
        'rounded-2': props.rounded,
    }
})

const emits = defineEmits(['click'])

const onClick = () => {
    emits('click')
}
</script>
