import { StatusCodes } from 'http-status-codes'
import { MOCK_ROLES_LEVEL_2 } from '~/models/rbac-level-2'

const isValidPermission = (requiredPermissions = []) => async (req, res, next) => {
  try {
    const userRole = req.jwtDecoded.role

    if (!userRole) {
      res.status(StatusCodes.FORBIDDEN).json({ message: 'Forbidden 2: You are not allowed to access this resource!' })
      return
    }

    const userRoleInfo = MOCK_ROLES_LEVEL_2.find((role) => role.name === userRole)
    if (!userRoleInfo) {
      res.status(StatusCodes.FORBIDDEN).json({ message: 'Forbidden 2: Role not found!' })
      return
    }

    const isHasPermission = requiredPermissions.every((requiredPermission) => {
      return userRoleInfo.permissions.includes(requiredPermission)
    })
    if (!isHasPermission) {
      res.status(StatusCodes.FORBIDDEN).json({ message: 'Forbidden 2: You do not have permission to access this resource!' })
      return
    }

    next()
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Internal Server Error 2: An error occurred while validating RBAC level 2!' })
    return
  }
}

export const rbacLevel2Middleware = {
  isValidPermission
}