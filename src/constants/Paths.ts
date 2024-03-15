/**
 * Express router paths go here.
 */

export default {
  BASE: '/api',
  PINGS: {
    BASE: '/pings',
  },
  USERS: {
    BASE: '/users',
    GET: '/:id',
    ADD: '/add',
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
