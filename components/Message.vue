<template>
  <div>
    <p>メッセージ: {{ message }}</p>
    <button @click="notifyParent">
      気分転換
    </button>
  </div>
</template>

<script>
export default {
  name: 'Message',
  props: {
    message: {
      type: String,
      required: true
    }
  },
  methods: {
    notifyParent() {
      this.$emit('messageClicked');
    }
  }
}
</script>

<style scoped>
p {
  font-size: 0.8em;
}
button {
  font-size: 0.8em;
  margin-top: 8px;
  padding: 4px 12px;
}
</style>
