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
    CHANGE_PASSWORD: '/password/:id',
  },
  FOOTBALL_FIELD: {
    BASE: '/fields',
    GET: '/:id',
    CREATE: '/create',
    UPDATE: '/update/:id',
    DELETE: '/delete/:id',
    LOCATION: '/locations',
    DAY_OF_SERVICE: '/:fieldId/day-of-services/:id',
    SUBFIELD: {
      ALL: '/:fieldId/subfields',
      DETAIL: '/:fieldId/subfields/:id',
    },
  },
  DAY_OF_SERVICE: {
    BASE: '/day-of-services',
    DETAIL: '/:id',
    BY_FIELD: '/fields/:id',
    BY_SUBFIELD: '/subfields/:id',
  },
  Examples: {
    BASE: '/examples',
    GET: '/all',
    ADD: '/add',
    UPDATE: '/update',
    DELETE: '/delete/:id',
  },
} as const
