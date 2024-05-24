import { Role } from '../api/models/RoleModel';

/**
 * @description checks if given string is a valid role, meaning that the string
 * is either client | admin | super.
 * @param r string
 * @returns true if valid role
 */
export const isValidRole = (r: string): boolean => Object.values(Role).includes(r);
