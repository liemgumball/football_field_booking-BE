/**
 * Express router paths go here.
 */

export default {
  Base: '/api',
  Pings: {
    Base: '/pings',
  },
  Users: {
    Base: '/users',
    Get: '/:id',
    Add: '/add',
    Update: '/update',
    Delete: '/delete/:id',
  },
  Examples: {
    Base: '/examples',
    Get: '/all',
    Add: '/add',
    Update: '/update',
    Delete: '/delete/:id',
  },
} as const
