<template>
    <div class="flex min-h-screen">
      <!-- Sidebar -->
      <sidebar />
      
      <!-- Contenu principal -->
      <main class="flex-1 ml-64 p-8 bg-gray-50 min-h-screen">
        <router-view />
      </main>
    </div>
  </template>
  
  <script>
  import Sidebar from '@/components/sidebar.vue' 
  
  export default {
    components: {
      Sidebar
    }
  }
  </script>