<template>
  <transition-group name="fade">
    <div
      v-for="toast in toasts"
      :key="toast.id"
      :class="`${toast.type}-toast`"
    >
      {{ toast.message }}
      <button @click="closeToast(toast.id)">×</button>
    </div>
  </transition-group>
</template>
<script>
export default {
  name: "Toast",
  data() {
    return {
      toasts: [],
    };
  },
  mounted() {
    this.$nuxt.$on('show-toast', ({ type, message }) => {
      const id = Date.now();
      this.toasts.unshift({ id, type, message });

      setTimeout(() => {
        this.closeToast(id);
      }, 3000);
    });
  },
  beforeDestroy() {
    this.$nuxt.$off('show-toast');
  },
  methods: {
    closeToast(id) {
      this.toasts = this.toasts.filter(toast => toast.id !== id);
    }
  }
};
</script>

<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: all 0.5s;
}
.fade-enter {
  transform: translateY(-100%);
  opacity: 0;
}
.fade-leave-to {
  transform: translateY(-100%);
  opacity: 0;
}
.success-toast {
  background-color: #d4edda;
  color: #155724;
  padding: 10px;
  border-radius: 5px;
  position: relative;
}
.success-toast button, .error-toast button, .warning-toast button, .info-toast button {
  position: absolute;
  top: 5px;
  right: 10px;
  background: none;
  border: none;
  font-size: 16px;
  cursor: pointer;
}
.error-toast {
  background-color: #f8d7da;
  color: #721c24;
  padding: 10px;
  border-radius: 5px;
}
.warning-toast {
  background-color: #fff3cd;
  color: #856404;
  padding: 10px;
  border-radius: 5px;
}
.info-toast {
  background-color: #d1ecf1;
  color: #0c5460;
  padding: 10px;
  border-radius: 5px;
}
</style>
