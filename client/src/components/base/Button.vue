<template>
  <button 
    :class="[
      'px-4 py-2 rounded-md font-medium transition-colors',
      variantClasses[variant],
      size === 'sm' ? 'text-sm' : size === 'lg' ? 'text-lg px-6 py-3' : 'text-base',
      disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer',
      block ? 'w-full' : ''
    ]"
    :disabled="disabled"
    v-bind="$attrs"
  >
    <slot></slot>
  </button>
</template>

<script setup>
const props = defineProps({
  variant: {
    type: String,
    default: 'primary',
    validator: (value) => ['primary', 'secondary', 'danger', 'warning', 'success', 'info'].includes(value)
  },
  size: {
    type: String,
    default: 'md',
    validator: (value) => ['sm', 'md', 'lg'].includes(value)
  },
  disabled: {
    type: Boolean,
    default: false
  },
  block: {
    type: Boolean,
    default: false
  }
})

const variantClasses = {
  primary: 'bg-[#0072E3] text-white hover:bg-[#0066CC]',
  secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300',
  danger: 'bg-red-600 text-white hover:bg-red-700',
  warning: 'bg-yellow-500 text-white hover:bg-yellow-600',
  success: 'bg-green-600 text-white hover:bg-green-700',
  info: 'bg-blue-400 text-white hover:bg-blue-500'
}
</script>
