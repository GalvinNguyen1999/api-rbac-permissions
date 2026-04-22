// Author: TrungQuanDev: https://youtube.com/@trungquandev
import { StatusCodes } from 'http-status-codes'
import { JwtProvider, ACCESS_TOKEN_SECRET_SIGNATURE } from '~/providers/JwtProvider'

// Middleware này sẽ đảm nhiệm việc quan trọng: lấy và xác thực cái JWT accessToken nhận được từ phía FE có hợp lệ hay không
const isAuthorized = async (req, res, next) => {
  // Cách 1: lấy accessToken nằm trong request cookies phía client - withCredentials trong file authorizeAxios và credentials trong cors
  const accessTokenFromCookie = req.cookies.accessToken
  if (!accessTokenFromCookie) {
    res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Unauthorized!' })
    return
  }

  // Cách 2: lấy accessToken trong trường hợp phía FE lưu localStorage và gửi lên thông qua header authorization
  const accessTokenFromHeader = req.headers.authorization // Bearer <token>. Cần phải dùng substring() để cắt bỏ chữ Bearer đi
  if (!accessTokenFromHeader) {
    res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Unauthorized!' })
    return
  }

  try {
    // Bước 1: Thực hiện giải mã token xem nó có hợp lệ hay là không ?
    const accessTokenDecoded = await JwtProvider.verifyToken(
      accessTokenFromHeader.substring('Bearer '.length),
      ACCESS_TOKEN_SECRET_SIGNATURE
    )

    // Bước 2: Quan trọng: nếu như cái token hợp lệ, thì sẽ cần phải lưu thông tin giải mã được vào cái req.jwtDecoded để sự dụng cho các tầng cần xử lý ở phía sau
    req.jwtDecoded = accessTokenDecoded

    // Bước 3: Cho phép cái request đi tiếp
    next()
  } catch (error) {
    console.log('Error from authMiddleware::', error)

    // Trường hợp lỗi 01: Nếu cái accessToken nó bị bắt hết hạn (expired) thì mình cần trả về một cái mã lỗi GONE 410 cho phía FE biết để gọi api refreshToken
    if (error.message?.includes('jwt expired')) {
      res.status(StatusCodes.GONE).json({ message: 'Token is expired!' })
      return
    }

    // Trường hợp lỗi 02: nếu như cái accessToken nó không hợp lệ do bất kỳ điều gì khác vụ hết hạn thì chúng ta cứ thẳng tay trả về mã 401 cho phía FE xử lý logout / hoặc gọi api logout tuỳ trường hợp
    res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Unauthorized! Please login again!' })
  }
}

export const authMiddleware = {
  isAuthorized
}
