<template>
  <div>
    <button class="baseButton" @click="save" :disabled="isDisabled">{{ buttonText }}</button>
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
.baseButton {
  padding: 10px 20px;
  border: 1px solid #000000;
  border-radius: 4px;
  font-size: 35px;
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}
.baseButton:disabled {
  color: #d4cccc;
  pointer-events: none;
  cursor: default;
}
</style>
