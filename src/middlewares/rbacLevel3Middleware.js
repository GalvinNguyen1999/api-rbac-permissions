import { StatusCodes } from 'http-status-codes'
import { MOCK_ROLES_LEVEL_3 } from '~/models/rbac-level-3'

const getPermissionByRole = async (roleName) => {
  const roleInfo = MOCK_ROLES_LEVEL_3.find((role) => role.name === roleName)
  if (!roleInfo) return []

  const userPermissions = new Set(roleInfo.permissions)

  for (const inheritRoleName of roleInfo.inherits) {
    const inheritRolePermissions = await getPermissionByRole(inheritRoleName)
    inheritRolePermissions.forEach((permission) => userPermissions.add(permission))
  }

  return userPermissions
}

const isValidPermission = (requiredPermissions = []) => async (req, res, next) => {
  try {
    const userRoles = req.jwtDecoded.role

    if (Array.isArray(userRoles) && userRoles.length === 0) {
      res.status(StatusCodes.FORBIDDEN).json({ message: 'Forbidden 3: You are not allowed to access this resource!' })
      return
    }

    const userPermissions = new Set()

    for (const role of userRoles) {
      const permissions = await getPermissionByRole(role)
      permissions.forEach((permission) => userPermissions.add(permission))
    }

    const isHasPermission = requiredPermissions.every((requiredPermission) => userPermissions.has(requiredPermission))
    if (!isHasPermission) {
      res.status(StatusCodes.FORBIDDEN).json({ message: 'Forbidden 3: You do not have permission to access this resource!' })
      return
    }

    next()
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Internal Server Error 2: An error occurred while validating RBAC level 2!' })
    return
  }
}

export const rbacLevel3Middleware = {
  isValidPermission
}