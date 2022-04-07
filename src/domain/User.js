export default class User {
  constructor(id, firstName, lastName, email, bio, githubUrl, password = null) {
    this.id = id
    this.firstName = firstName
    this.lastName = lastName
    this.email = email
    this.bio = bio
    this.githubUrl = githubUrl
    this.password = password
  }

  static fromJson(json) {
    // eslint-disable-next-line camelcase
    const { first_name, last_name, email, biography, github_url, password } =
      json

    return new User(
      null,
      first_name,
      last_name,
      email,
      biography,
      github_url,
      password
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
}
