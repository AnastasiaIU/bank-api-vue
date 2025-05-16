import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { ROUTE_NAMES } from './routes.js'
import WelcomeView from '../views/WelcomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: ROUTE_NAMES.WELCOME,
      component: WelcomeView,
      meta: { guards: ['auth'] }
    },
    {
      path: '/login',
      name: ROUTE_NAMES.LOGIN,
      component: () => import('../views/LoginView.vue'),
      meta: { guards: ['guest'] }
    },
    {
      path: '/register',
      name: ROUTE_NAMES.REGISTER,
      component: () => import('../views/RegisterView.vue'),
      meta: { guards: ['guest'] }
    },
    {
      path: '/transfer',
      name: ROUTE_NAMES.TRANSFER,
      component: () => import('../views/TransferFundsView.vue'),
      meta: { guards: ['auth'] }
    },
    {
      path: '/transactions',
      name: ROUTE_NAMES.TRANSACTIONS,
      component: () => import('../views/AccountTransactionsViews.vue'),
      meta: { guards: ['auth'] }
    },
    {
      path: '/account',
      name: ROUTE_NAMES.ACCOUNT,
      component: () => import('../views/AccountView.vue'),
      meta: { guards: ['auth'] }
    },
    {
      path: '/accounts',
      name: ROUTE_NAMES.ACCOUNTS,
      component: () => import('../views/AccountsView.vue'),
      meta: { guards: ['auth', 'employee'] }
    },
    {
      path: '/atm/deposit',
      name: ROUTE_NAMES.ATM_DEPOSIT,
      component: () => import('../views/AtmView.vue'),
      meta: { guards: ['auth', 'customer'] },
      props: { transactionType: 'Deposit' }
    },
    {
      path: '/atm/withdraw',
      name: ROUTE_NAMES.ATM_WITHDRAW,
      component: () => import('../views/AtmView.vue'),
      meta: { guards: ['auth', 'customer'] },
      props: { transactionType: 'Withdraw' }
    },
    {
      path: '/customers/pending',
      name: ROUTE_NAMES.CUSTOMER_APPROVALS,
      component: () => import('../views/CustomerApprovalsView.vue'),
      meta: { guards: ['auth', 'employee'] }
    },
    {
      path: '/lookup',
      name: ROUTE_NAMES.LOOKUP,
      component: () => import('../views/LookupView.vue'),
      meta: { guards: ['auth', 'customer'] }
    }
  ],
})

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()

  const isAuth = authStore.isAuthenticated
  const isEmployee = authStore.isEmployee
  const guards = to.meta.guards || []

  if (guards.includes('auth') && !isAuth) {
    return next({ name: 'login' })
  }

  if (guards.includes('guest') && isAuth) {
    return next({ name: 'welcome' })
  }

  if (guards.includes('employee') && !isEmployee) {
    return next({ name: 'welcome' })
  }

  if (guards.includes('customer') && isEmployee) {
    return next({ name: 'welcome' })
  }

  next()
})

export default router
