// Author: TrungQuanDev: https://youtube.com/@trungquandev
import express from 'express'
import { StatusCodes } from 'http-status-codes'
import { dashboardController } from '~/controllers/dashboardController'
import { authMiddleware } from '~/middlewares/authMiddleware'
import { rbacLevel1Middleware } from '~/middlewares/rbacLevel1Middleware'
import { MOCK_ROLES_LEVEL_1 } from '~/models/rbac-lever-1'
import { rbacLevel2Middleware } from '~/middlewares/rbacLevel2Middleware'
import { rbacLevel3Middleware } from '~/middlewares/rbacLevel3Middleware'

const Router = express.Router()

Router.route('/access')
  .get(authMiddleware.isAuthorized, dashboardController.access)

Router.route('/messages')
  .get(
    authMiddleware.isAuthorized,
    rbacLevel3Middleware.isValidPermission(['read-message']),
    (req, res) => {
      res.status(StatusCodes.OK).json({ message: 'Messages access successfully!' })
    }
  )

Router.route('/admin-tools')
  .get(
    authMiddleware.isAuthorized,
    rbacLevel3Middleware.isValidPermission(['read-admin-tool']),
    (req, res) => {
      res.status(StatusCodes.OK).json({ message: 'Admin tools access successfully!' })
    }
  )

export const dashboardRoute = Router
