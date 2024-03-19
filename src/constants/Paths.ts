/**
 * Express router paths go here.
 */

export default {
  BASE: '/api',
  PINGS: {
    BASE: '/pings',
  },
  AUTH: {
    BASE: '/auth',
    LOGIN: '/login',
    SIGNUP: '/signup',
  },
  USERS: {
    BASE: '/users',
    GET: '/:id',
    UPDATE: '/update/:id',
    DELETE: '/delete/:id',
  },
  FOOTBALL_FIELD: {
    BASE: '/fields',
    GET: '/:id',
    CREATE: '/create',
    UPDATE: '/update/:id',
    DELETE: '/delete/:id',
  },
  Examples: {
    BASE: '/examples',
    GET: '/all',
    ADD: '/add',
    UPDATE: '/update',
    DELETE: '/delete/:id',
  },
} as const
