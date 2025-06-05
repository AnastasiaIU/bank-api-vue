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
      meta: { guards: ['auth', 'approval'] }
    },
    {
      path: '/transactions',
      name: ROUTE_NAMES.TRANSACTIONS,
      component: () => import('../views/AccountTransactionsViews.vue'),
      meta: { guards: ['auth', 'approval'] }
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
      meta: { guards: ['auth', 'customer', 'approval'] },
      props: { transactionType: 'Deposit' }
    },
    {
      path: '/atm/withdraw',
      name: ROUTE_NAMES.ATM_WITHDRAW,
      component: () => import('../views/AtmView.vue'),
      meta: { guards: ['auth', 'customer', 'approval'] },
      props: { transactionType: 'Withdraw' }
    },
    {
      path: '/users/review',
      name: ROUTE_NAMES.CUSTOMER_REVIEW,
      component: () => import('../views/CustomerReviewView.vue'),
      meta: { guards: ['auth', 'employee'] }
    },
    {
      path: '/users/approval/:id',
      name: ROUTE_NAMES.CUSTOMER_APPROVAL,
      component: () => import('../views/CustomerApprovalView.vue'),
    },
    {
      path: '/lookup',
      name: ROUTE_NAMES.LOOKUP,
      component: () => import('../views/LookupView.vue'),
      meta: { guards: ['auth', 'customer', 'approval'] }
    },
    {
      path: '/users/active',
      name: ROUTE_NAMES.ACTIVE_USERS,
      component: () => import('../views/ActiveUsersAccountsView.vue'),
      meta: { guards: ['auth', 'employee'] }
    },
    {
      path: '/employee/transactions/:accountId',
      name: ROUTE_NAMES.EMPLOYEE_TRANSACTIONS,
      component: () => import('../views/EmployeeTransactionView.vue'),
      meta: { guards: ['auth', 'employee'] }
    }
  ],
})

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()

  const isAuth = authStore.isAuthenticated
  const isEmployee = authStore.isEmployee
  const isApproved = authStore.isApproved
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

  if (guards.includes('approval') && !isApproved) {
    return next({ name: 'welcome' })
  }

  next()
})

export default router
