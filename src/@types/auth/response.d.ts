interface LoginResponse {
  accessToken: string
  user: UserData
}

interface UserData {
  id: string
  email: string
  userName: string
}