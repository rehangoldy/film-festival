<template>
  <div class="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-md">
      <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">Create your account</h2>
    </div>

    <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
      <div class="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
        <form class="space-y-6" @submit.prevent="handleSubmit">
          <div v-if="authStore.error" class="p-4 text-sm text-red-700 bg-red-100 rounded-lg">
            {{ authStore.error }}
          </div>

          <div>
            <Label for="name">Full Name</Label>
            <div class="mt-1">
              <Input
                id="name"
                type="text"
                v-model="form.name"
                required
                autocomplete="name"
              />
            </div>
          </div>

          <div>
            <Label for="email">Email address</Label>
            <div class="mt-1">
              <Input
                id="email"
                type="email"
                v-model="form.email"
                required
                autocomplete="email"
              />
            </div>
          </div>

          <div>
            <Label for="password">Password</Label>
            <div class="mt-1">
              <Input
                id="password"
                type="password"
                v-model="form.password"
                required
                autocomplete="new-password"
              />
            </div>
          </div>

          <div>
            <Label for="password_confirmation">Confirm Password</Label>
            <div class="mt-1">
              <Input
                id="password_confirmation"
                type="password"
                v-model="form.password_confirmation"
                required
                autocomplete="new-password"
              />
            </div>
          </div>

          <div>
            <Button type="submit" variant="primary" block :loading="authStore.loading">
              Create Account
            </Button>
          </div>
        </form>

        <div class="mt-6">
          <div class="relative">
            <div class="absolute inset-0 flex items-center">
              <div class="w-full border-t border-gray-300"></div>
            </div>
            <div class="relative flex justify-center text-sm">
              <span class="px-2 bg-white text-gray-500">
                Already have an account?
              </span>
            </div>
          </div>

          <div class="mt-6">
            <router-link to="/login">
              <Button variant="secondary" block>
                Sign in instead
              </Button>
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/auth'
import { useAlertStore } from '../../stores/alert'
import Button from '../../components/base/Button.vue'
import Input from '../../components/base/Input.vue'
import Label from '../../components/base/Label.vue'

const router = useRouter()
const authStore = useAuthStore()
const alertStore = useAlertStore()

const form = ref({
  name: '',
  email: '',
  password: '',
  password_confirmation: ''
})

const handleSubmit = async () => {
  if (form.value.password !== form.value.password_confirmation) {
    alertStore.error('Registration Failed', 'Passwords do not match')
    return
  }

  try {
    const success = await authStore.register({
      name: form.value.name,
      email: form.value.email,
      password: form.value.password
    })
    if (success) {
      router.push('/login')
    }
  } catch (error) {
    alertStore.error('Registration Failed', error.message)
  }
}
</script>
