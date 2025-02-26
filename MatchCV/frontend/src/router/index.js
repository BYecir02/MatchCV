const routes = [
    {
      path: '/',
      component: () => import('@/layouts/MainLayout.vue'),
      children: [
        { path: '/dashboard', component: () => import('@/views/Dashboard.vue') },
        // Ajoutez ici toutes vos routes enfants
      ]
    }
  ]