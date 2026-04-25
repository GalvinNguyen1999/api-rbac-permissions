import { StatusCodes } from 'http-status-codes'

const isValidateRbacLevel1 = (roles) => async (req, res, next) => {
  try {
    const userRole = req.jwtDecoded.role

    if (!userRole || !roles.includes(userRole)) {
      res.status(StatusCodes.FORBIDDEN).json({ message: 'You are not allowed to access this resource!' })
      return
    }

    next()
  } catch (error) {
    console.log('Error from rbacLevel1Middleware::', error)
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'An error occurred while validating RBAC level 1!' })
    return
  }
}

export const rbacLevel1Middleware = {
  isValidateRbacLevel1
}