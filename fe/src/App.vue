<script setup lang="ts">
import { onMounted, ref } from 'vue'
import type { ApiInfo } from './types/ApiInfo'

const data = ref<ApiInfo | null>(null)
const error = ref<string | null>(null)

const fetchInfo = async () => {
  try {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/info`)

    if (!res.ok) {
      throw new Error(`HTTP error ${res.status}`)
    }

    const json: ApiInfo = await res.json()
    data.value = json
  } catch (err) {
    error.value = (err as Error).message
  }
}

onMounted(async () => {
  await fetchInfo()
})
</script>

<template>
  <div class="container">
    <div class="card">
      <h1 class="title">Frontend</h1>

      <div v-if="data" class="content">
        <div class="info-item">
          <span class="label">Service</span>
          <span class="value">{{ data.service }}</span>
        </div>
        <div class="info-item">
          <span class="label">Message</span>
          <span class="value">{{ data.message }}</span>
        </div>
        <div class="info-item">
          <span class="label">User</span>
          <span class="value">{{ data.user }}</span>
        </div>
      </div>

      <div v-else-if="error" class="error">
        <span>⚠️ {{ error }}</span>
      </div>
      <div v-else class="loading">
        <span class="loader"></span>
        <span>Loading...</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  padding: 20px;
}

.card {
  background: white;
  border-radius: 16px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  padding: 40px;
  max-width: 500px;
  width: 100%;
}

.title {
  margin: 0 0 30px 0;
  font-size: 32px;
  font-weight: 700;
  color: #2d3748;
  text-align: center;
}

.content {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 16px;
  background: #f7fafc;
  border-radius: 12px;
  border-left: 4px solid #667eea;
}

.label {
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  color: #718096;
  letter-spacing: 0.5px;
}

.value {
  font-size: 16px;
  font-weight: 500;
  color: #2d3748;
}

.error {
  text-align: center;
  color: #e53e3e;
  padding: 20px;
  background: #fff5f5;
  border-radius: 12px;
  font-weight: 500;
}

.loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  padding: 40px 0;
  color: #718096;
}

.loader {
  width: 40px;
  height: 40px;
  border: 4px solid #e2e8f0;
  border-top-color: #667eea;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>
