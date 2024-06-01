import validator from 'validator'

const regex = /^(?=.*[a-z])(?=.*[A-Z])/ // 密碼必須包含一個大小以及一個小寫字母

interface SignUpData {
  name: string
  email: string
  password: string
  passwordConfirm: string
}

export const validateSignUpData = ({ name, email, password, passwordConfirm }: SignUpData): string | null => {
  if (!name || !email || !password || !passwordConfirm) {
    return '有欄位尚未填寫！'
  }
  if (!validator.isEmail(email)) {
    return '電子郵件格式錯誤'
  }
  if (!regex.test(password)) {
    return '密碼格式不正確，必須包含至少一個大寫字母和一個小寫字母'
  }
  if (!validator.isLength(password, { min: 8 })) {
    return '密碼至少要 8 個字元'
  }
  if (password !== passwordConfirm) {
    return '密碼不一致，請重新輸入'
  }

  return null
}
