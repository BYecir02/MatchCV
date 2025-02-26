<template>
  <!-- Point d'entrée unique pour le routeur -->
  <router-view/>
</template>

<script>
// Aucun import nécessaire ici si vous utilisez le layout via le routeur
export default {
  name: 'App'
}
</script>

<style>
/* Styles globaux optionnels */
body {
  @apply bg-gray-50;
}
</style>