import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'

export default class AuthController {
  /**
   * Handle user registration
   */
  async register({ request }: HttpContext) {
    const { email, password, fullName } = request.only(['email', 'password', 'fullName'])

    const user = await User.create({
      email,
      password,
      fullName,
    })

    const token = await User.accessTokens.create(user)

    return {
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
      },
      token: token.value!.release(),
    }
  }

  /**
   * Handle user login
   */
  async login({ request }: HttpContext) {
    const { email, password } = request.only(['email', 'password'])

    const user = await User.verifyCredentials(email, password)
    const token = await User.accessTokens.create(user)

    return {
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
      },
      token: token.value!.release(),
    }
  }

  /**
   * Handle user logout
   */
  async logout({ auth }: HttpContext) {
    const user = auth.getUserOrFail()
    await User.accessTokens.delete(user, user.currentAccessToken.identifier)

    return { message: 'Logout realizado com sucesso' }
  }

  /**
   * Get authenticated user info
   */
  async me({ auth }: HttpContext) {
    const user = auth.getUserOrFail()
    await user.load('livros')
    
    return user
  }
}
