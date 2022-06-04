<template>
  <button class="test-button" @click="onClick">
    <slot>{{ content }}</slot>
  </button>
</template>

<script lang="ts" setup>
defineProps({
  content: { type: String }
});
defineEmits(['click']);

function onClick() {
  alert('success');
}
</script>
