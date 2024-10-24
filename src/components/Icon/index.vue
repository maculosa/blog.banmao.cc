<template>
    <Icon :icon="props.icon"></Icon>
</template>
<script lang="ts" setup>
import { Icon } from '@iconify/vue'

interface IconProps {
    icon: string
}

const props = defineProps<IconProps>()
</script>
