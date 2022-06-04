<template>
  <input class="test-input" v-bind="$attrs" :placeholder="placeholder" />
</template>

<script lang="ts" setup>
defineProps({
  placeholder: { type: String }
});
defineEmits(['click']);
</script>
