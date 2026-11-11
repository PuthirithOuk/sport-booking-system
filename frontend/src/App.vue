<script setup lang="ts">
import { RouterView, RouterLink } from 'vue-router'
</script>

<template>
  <div class="app-shell">
    <nav>
      <RouterLink to="/">Home</RouterLink>
      <RouterLink to="/bookings">My Bookings</RouterLink>
    </nav>

    <main>
      <RouterView />
    </main>
  </div>
</template>

<style>
body { font-family: sans-serif; margin: 0; padding: 20px; }
nav { margin-bottom: 20px; display: flex; gap: 16px; }
nav a { text-decoration: none; color: blue; }
</style>