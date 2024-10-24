<template>
    <div :class="`i-${props.icon} w-1em h-1em`"></div>
</template>
<script lang="ts" setup>

interface IconProps {
    icon: string
}

const props = defineProps<IconProps>()
</script>
