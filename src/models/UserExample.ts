// **** Variables **** //

const INVALID_CONSTRUCTOR_PARAM =
  'nameOrObj arg must a string or an ' +
  'object with the appropriate userE keys.';

export enum UserERoles {
  Standard,
  Admin,
}

// **** Types **** //

export interface IUserE {
  id: number;
  name: string;
  email: string;
  pwdHash?: string;
  role?: UserERoles;
}

export interface ISessionUserE {
  id: number;
  email: string;
  name: string;
  role: IUserE['role'];
}

// **** Functions **** //

/**
 * Create new UserE.
 */
function new_(
  name?: string,
  email?: string,
  role?: UserERoles,
  pwdHash?: string,
  id?: number, // id last cause usually set by db
): IUserE {
  return {
    id: id ?? -1,
    name: name ?? '',
    email: email ?? '',
    role: role ?? UserERoles.Standard,
    pwdHash: pwdHash ?? '',
  };
}

/**
 * Get userE instance from object.
 */
function from(param: object): IUserE {
  // Check is userE
  if (!isUserE(param)) {
    throw new Error(INVALID_CONSTRUCTOR_PARAM);
  }
  // Get userE instance
  const p = param as IUserE;
  return new_(p.name, p.email, p.role, p.pwdHash, p.id);
}

/**
 * See if the param meets criteria to be a userE.
 */
function isUserE(arg: unknown): boolean {
  return (
    !!arg &&
    typeof arg === 'object' &&
    'id' in arg &&
    'email' in arg &&
    'name' in arg &&
    'role' in arg
  );
}

// **** Export default **** //

export default {
  new: new_,
  from,
  isUserE,
} as const;
