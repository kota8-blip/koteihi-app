<template>
  <div>
    <button @click="save" :disabled="isDisabled">{{ buttonText }}</button>
  </div>
</template>

<script>
export default {
  name: 'BaseButton',
  props: {
    buttonText: {
      type: String,
      required: true
    },
    isDisabled: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    save() {
      this.$emit('click');
    }
  }
}

</script>

<style scoped>
</style>
