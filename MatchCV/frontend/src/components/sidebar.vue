<template>
    <aside class="h-screen w-64 bg-white shadow-lg fixed left-0 overflow-y-auto">
      <!-- Profil Utilisateur -->
      <div class="p-4 border-b">
        <div class="flex items-center gap-3">
          <img 
            src="@/assets/avatar.png" 
            class="w-10 h-10 rounded-full object-cover"
            alt="Avatar"
          />
          <div>
            <p class="font-semibold text-gray-800">{{ user.name }}</p>
            <p class="text-sm text-gray-500 truncate">{{ user.email }}</p>
          </div>
        </div>
      </div>
  
      <!-- Menu Navigation -->
      <nav class="p-4 space-y-1">
        <!-- Tableau de bord -->
        <router-link 
          to="/dashboard" 
          class="flex items-center gap-3 p-2 rounded-lg hover:bg-blue-50"
          :class="{ 'bg-blue-50 text-blue-600': $route.path === '/dashboard' }"
        >
          🏠 Tableau de bord
        </router-link>
  
        <!-- Offres d'emploi -->
        <div class="menu-group">
          <p class="text-xs font-semibold text-gray-500 uppercase mt-4 mb-2">Offres d'emploi</p>
          <router-link 
            v-for="item in menuItems.jobOffers" 
            :key="item.to"
            :to="item.to"
            class="flex items-center gap-3 p-2 ml-2 rounded-lg hover:bg-blue-50"
            :class="{ 'bg-blue-50 text-blue-600': $route.path === item.to }"
          >
            {{ item.icon }} {{ item.title }}
            <span v-if="item.badge" class="ml-auto bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
              {{ item.badge }}
            </span>
          </router-link>
        </div>
  
        <!-- Mon Profil -->
        <div class="menu-group">
          <p class="text-xs font-semibold text-gray-500 uppercase mt-4 mb-2">Mon Profil</p>
          <router-link 
            v-for="item in menuItems.profile" 
            :key="item.to"
            :to="item.to"
            class="flex items-center gap-3 p-2 ml-2 rounded-lg hover:bg-blue-50"
            :class="{ 'bg-blue-50 text-blue-600': $route.path === item.to }"
          >
            {{ item.icon }} {{ item.title }}
          </router-link>
        </div>
  
        <!-- Génération de documents -->
        <div class="menu-group">
          <p class="text-xs font-semibold text-gray-500 uppercase mt-4 mb-2">Documents</p>
          <router-link 
            v-for="item in menuItems.documents" 
            :key="item.to"
            :to="item.to"
            class="flex items-center gap-3 p-2 ml-2 rounded-lg hover:bg-blue-50"
            :class="{ 'bg-blue-50 text-blue-600': $route.path === item.to }"
          >
            {{ item.icon }} {{ item.title }}
          </router-link>
        </div>
  
        <!-- Autres sections... -->
      </nav>
    </aside>
  </template>
  
  <script>
  export default {
    data() {
      return {
        user: {
          name: "John Doe",
          email: "john@matchcv.com"
        },
        menuItems: {
          jobOffers: [
            { icon: '📋', title: 'Analyser une annonce', to: '/analyze-job' },
            { icon: '📚', title: 'Historique', to: '/job-history' },
            { icon: '✅', title: 'Correspondances', to: '/matches', badge: '85%' }
          ],
          profile: [
            { icon: '🛠️', title: 'Compétences', to: '/profile/skills' },
            { icon: '💼', title: 'Expériences', to: '/profile/experience' },
            { icon: '🎓', title: 'Formations', to: '/profile/education' }
          ],
          documents: [
            { icon: '📄', title: 'Générer CV', to: '/generate-cv' },
            { icon: '✉️', title: 'Générer lettre', to: '/generate-letter' },
            { icon: '🎨', title: 'Modèles', to: '/templates' }
          ]
        }
      }
    }
  }
  </script>
  
  <style scoped>
  .menu-group {
    @apply transition-colors duration-200 ease-in-out;
  }
  
  .router-link-exact-active {
    @apply font-medium bg-blue-50 text-blue-600;
  }
  </style>