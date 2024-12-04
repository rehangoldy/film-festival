<template>
  <div 
    :class="[
      'bg-white rounded-lg overflow-hidden',
      bordered ? 'border border-gray-200' : 'shadow-md',
      hoverable ? 'transition-shadow hover:shadow-lg' : '',
      padding ? `p-${padding}` : ''
    ]"
  >
    <!-- Card Header -->
    <div 
      v-if="$slots.header || title" 
      class="px-6 py-4 border-b border-gray-200"
    >
      <slot name="header">
        <h3 class="text-lg font-semibold text-gray-900">{{ title }}</h3>
      </slot>
    </div>

    <!-- Card Image -->
    <div v-if="$slots.image" class="w-full">
      <slot name="image"></slot>
    </div>

    <!-- Card Body -->
    <div :class="[
      bodyClass,
      padding ? '' : 'p-6'
    ]">
      <slot></slot>
    </div>

    <!-- Card Footer -->
    <div 
      v-if="$slots.footer" 
      class="px-6 py-4 border-t border-gray-200 bg-gray-50"
    >
      <slot name="footer"></slot>
    </div>
  </div>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    default: ''
  },
  bordered: {
    type: Boolean,
    default: false
  },
  hoverable: {
    type: Boolean,
    default: false
  },
  padding: {
    type: [Number, String],
    default: '',
    validator: (value) => {
      if (typeof value === 'number') return value >= 0 && value <= 6
      if (typeof value === 'string') return ['sm', 'md', 'lg'].includes(value)
      return true
    }
  },
  bodyClass: {
    type: String,
    default: ''
  }
})
</script>
