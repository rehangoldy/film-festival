import { defineStore } from 'pinia'

export const useAlertStore = defineStore('alert', {
  state: () => ({
    show: false,
    type: 'info',
    title: '',
    message: '',
    timer: null
  }),

  actions: {
    showAlert({ type = 'info', title, message = '', timeout = 3000 }) {
      // Clear any existing timer
      if (this.timer) {
        clearTimeout(this.timer)
      }

      this.show = true
      this.type = type
      this.title = title
      this.message = message

      // Set new timer
      this.timer = setTimeout(() => {
        this.hideAlert()
      }, timeout)
    },

    hideAlert() {
      this.show = false
      this.type = 'info'
      this.title = ''
      this.message = ''
      
      if (this.timer) {
        clearTimeout(this.timer)
        this.timer = null
      }
    },

    success(title, message = '') {
      this.showAlert({ type: 'success', title, message })
    },

    error(title, message = '') {
      this.showAlert({ type: 'error', title, message })
    },

    info(title, message = '') {
      this.showAlert({ type: 'info', title, message })
    }
  }
})
