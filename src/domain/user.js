import dbClient from '../utils/dbClient.js'
import bcrypt from 'bcrypt'

/**
 * @param {User} user
 * @returns {User}
 */
export async function createNewUser(user) {
  const createdUser = await dbClient.user.create({
    data: {
      email: user.email,
      password: user.passwordHash,
      profile: {
        create: {
          firstName: user.firstName,
          lastName: user.lastName,
          bio: user.bio,
          githubUrl: user.githubUrl
        }
      }
    },
    include: {
      profile: true
    }
  })

  return User.fromDb(createdUser)
}

export class User {
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
}
