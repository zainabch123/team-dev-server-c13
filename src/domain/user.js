import dbClient from '../utils/dbClient.js'
import bcrypt from 'bcrypt'

export default class User {
  /**
   * This is JSDoc - a way for us to tell other developers what types functions/methods
   * take as inputs, what types they return, and other useful information that JS doesn't have built in
   * @tutorial https://www.valentinog.com/blog/jsdoc
   *
   * @param { { id: string, email: string, profile: { firstName: string, lastName: string, bio: string, githubUrl: string }} } user
   * @returns {User}
   */
  static fromDb(user) {
    return new User(
      user.id,
      user.profile.firstName,
      user.profile.lastName,
      user.email,
      user.profile.bio,
      user.profile.githubUrl
    )
  }

  static async fromJson(json) {
    // eslint-disable-next-line camelcase
    const { first_name, last_name, email, biography, github_url, password } =
      json

    const passwordHash = await bcrypt.hash(password, 8)

    return new User(
      null,
      first_name,
      last_name,
      email,
      biography,
      github_url,
      passwordHash
    )
  }

  constructor(
    id,
    firstName,
    lastName,
    email,
    bio,
    githubUrl,
    passwordHash = null
  ) {
    this.id = id
    this.firstName = firstName
    this.lastName = lastName
    this.email = email
    this.bio = bio
    this.githubUrl = githubUrl
    this.passwordHash = passwordHash
  }

  toJSON() {
    return {
      user: {
        id: this.id,
        first_name: this.firstName,
        last_name: this.lastName,
        email: this.email,
        biography: this.bio,
        github_url: this.githubUrl
      }
    }
  }

  /**
   * @returns {User}
   *  A user instance containing an ID, representing the user data created in the database
   */
  async save() {
    const createdUser = await dbClient.user.create({
      data: {
        email: this.email,
        password: this.passwordHash,
        profile: {
          create: {
            firstName: this.firstName,
            lastName: this.lastName,
            bio: this.bio,
            githubUrl: this.githubUrl
          }
        }
      },
      include: {
        profile: true
      }
    })

    return User.fromDb(createdUser)
  }
}
