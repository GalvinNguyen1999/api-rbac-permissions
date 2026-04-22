// Author: TrungQuanDev: https://youtube.com/@trungquandev
import JWT from 'jsonwebtoken'

// ** Hàm tạo JWT Token **
// Tham số 1: userInfo: Thông tin user cần mã hóa vào token
// Tham số 2: secretSignature: Chữ ký bí mật để mã hóa token
// Tham số 3: tokenLife: Thời gian sống của token
const generateToken = async (userInfo, secretSignature, tokenLife) => {
  try {
    return JWT.sign(userInfo, secretSignature, {
      algorithm: 'HS256',
      expiresIn: tokenLife
    })
  } catch (error) {
    throw new Error(error)
  }
}

// ** Hàm giải mã JWT Token **
// Tham số 1: token: Token cần giải mã
// Tham số 2: secretSignature: Chữ ký bí mật để giải mã token
// => Đảm bảo secretSignature giống với secretSignature khi tạo token
const verifyToken = async (token, secretSignature) => {
  try {
    return JWT.verify(token, secretSignature)
  } catch (error) {
    throw new Error(error)
  }
}

/**
 * 2 cái chữ ký bí mật quan trọng trong dự án. Dành cho JWT - Jsonwebtokens
 * Lưu ý phải lưu vào biến môi trường ENV trong thực tế cho bảo mật.
 * Ở đây mình làm Demo thôi nên mới đặt biến const và giá trị random ngẫu nhiên trong code nhé.
 * Xem thêm về biến môi trường: https://youtu.be/Vgr3MWb7aOw
 */
export const ACCESS_TOKEN_SECRET_SIGNATURE = 'EbGgpdAIRosZ49Q7MewhxslUr4vCy8ju'
export const REFRESH_TOKEN_SECRET_SIGNATURE = 'Ceq4yW2gvAjcJrI7aQpPIW0p2gDBuGV6'

export const JwtProvider = {
  generateToken,
  verifyToken
}
