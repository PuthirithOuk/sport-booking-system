<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const email = ref('')
const password = ref('')
const submitted = ref(false)

// Simple validation
function validate() {
  const errors = []
  if (!email.value.includes('@')) errors.push('Email must be valid')
  if (password.value.length < 6) errors.push('Password must be at least 6 characters')
  return errors
}

function onSubmit() {
  submitted.value = true
  const errors = validate()
  
  if (errors.length > 0) return // Stop if there are errors
  
  // Fake login success
  alert('Logged in successfully!')
  router.push('/') // Go to home page
}
</script>

<template>
  <div style="max-width: 400px; margin: 0 auto;">
    <h1>Login</h1>
    
    <form @submit.prevent="onSubmit" style="display: flex; flex-direction: column; gap: 10px;">
      <div>
        <label>Email</label><br>
        <input v-model="email" type="text" style="width: 100%; padding: 8px;">
        <p v-if="submitted && !email.includes('@')" style="color: red; font-size: 0.8em;">
          Email must be valid
        </p>
      </div>

      <div>
        <label>Password</label><br>
        <input v-model="password" type="password" style="width: 100%; padding: 8px;">
        <p v-if="submitted && password.length < 6" style="color: red; font-size: 0.8em;">
          Password must be at least 6 characters
        </p>
      </div>

      <button type="submit" style="padding: 10px; background: black; color: white; cursor: pointer;">
        Log In
      </button>
    </form>
  </div>
</template>