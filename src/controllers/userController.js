// Author: TrungQuanDev: https://youtube.com/@trungquandev
import { StatusCodes } from 'http-status-codes'
import ms from 'ms'
import { JwtProvider, ACCESS_TOKEN_SECRET_SIGNATURE, REFRESH_TOKEN_SECRET_SIGNATURE } from '~/providers/JwtProvider'

/**
 * Mock nhanh thông tin user thay vì phải tạo Database rồi query.
 * Nếu muốn học kỹ và chuẩn chỉnh đầy đủ hơn thì xem Playlist này nhé:
 * https://www.youtube.com/playlist?list=PLP6tw4Zpj-RIMgUPYxhLBVCpaBs94D73V
 */

const MOCK_ROLES = {
  ADMIN: 'admin',
  CLIENT: 'client',
  MODERATOR: 'moderator'
}

const MOCK_DATABASE = {
  USER: {
    ID: 'trungquandev-sample-id-12345678',
    EMAIL: 'trungquandev.official@gmail.com',
    PASSWORD: 'trungquandev@123',
    ROLE: MOCK_ROLES.CLIENT
  }
}

const login = async (req, res) => {
  try {
    if (
      req.body.email !== MOCK_DATABASE.USER.EMAIL ||
      req.body.password !== MOCK_DATABASE.USER.PASSWORD
    ) {
      res
        .status(StatusCodes.FORBIDDEN)
        .json({ message: 'Your email or password is incorrect!' })
      return
    }

    // Trường hợp nhập đúng thông tin tài khoản, tạo token và trả về cho phía Client
    // step 1: mock data user
    const userInfo = {
      id: MOCK_DATABASE.USER.ID,
      email: MOCK_DATABASE.USER.EMAIL,
      role: MOCK_DATABASE.USER.ROLE
    }

    // step 2: generate access token (lưu ý: thời gian sống của access token phải nhỏ hơn refresh token vì khi access token hết hạn thì client sẽ request refresh token để lấy access token mới)
    const accessToken = await JwtProvider.generateToken(
      userInfo,
      ACCESS_TOKEN_SECRET_SIGNATURE,
      '1h' // 1 hour
    )

    // step 3: generate refresh token (lưu ý: thời gian sống của refresh token phải lớn hơn access token để client có thể request refresh token khi access token hết hạn)
    const refreshToken = await JwtProvider.generateToken(
      userInfo,
      REFRESH_TOKEN_SECRET_SIGNATURE,
      '14 days'
    )

    // step 4: Lưu access token và refresh token vào cookie của client thông qua httpOnly cookie
    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: ms('14 days') // bởi vì refresh token có thời gian sống là 14 ngày nên maxAge của cookie cũng phải là 14 ngày. nếu maxAge của cookie nhỏ hơn thời gian sống của refresh token thì cookie sẽ bị xóa trước khi refresh token hết hạn
    })

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: ms('14 days') // bởi vì refresh token có thời gian sống là 14 ngày nên maxAge của cookie cũng phải là 14 ngày. nếu maxAge của cookie nhỏ hơn thời gian sống của refresh token thì cookie sẽ bị xóa trước khi refresh token hết hạn
    })

    // step 5: trả về thông tin user, access token và refresh token cho client để lưu vào local storage
    res.status(StatusCodes.OK).json({
      ...userInfo,
      accessToken,
      refreshToken
    })
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error)
  }
}

const logout = async (req, res) => {
  try {
    // Xoá cookie -> đơn giản là làm ngược lại login
    res.clearCookie('accessToken')
    res.clearCookie('refreshToken')

    res.status(StatusCodes.OK).json({ message: 'Logout API success!' })
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error)
  }
}

const refreshToken = async (req, res) => {
  try {
    const refreshTokenFromCookie = req.cookies.refreshToken // Cách dùng httpOnly Cookie
    const refreshTokenFromBody = req.body.refreshToken // Cách dùng Local Storage

    const decodedToken = await JwtProvider.verifyToken(refreshTokenFromBody, REFRESH_TOKEN_SECRET_SIGNATURE)

    const userInfo = {
      id: decodedToken.id,
      email: decodedToken.email,
      role: decodedToken.role
    }

    const accessToken = await JwtProvider.generateToken(userInfo, ACCESS_TOKEN_SECRET_SIGNATURE, '1h')
    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: ms('14 days') // bởi vì refresh token có thời gian sống là 14 ngày nên maxAge của cookie cũng phải là 14 ngày. nếu maxAge của cookie nhỏ hơn thời gian sống của refresh token thì cookie sẽ bị xóa trước khi refresh token hết hạn
    })

    res.status(StatusCodes.OK).json({
      accessToken
    })
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Refresh token API failed!' })
  }
}

export const userController = {
  login,
  logout,
  refreshToken
}
