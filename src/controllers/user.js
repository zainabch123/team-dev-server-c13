import { User, createNewUser } from '../domain/user.js'

export const create = async (req, res) => {
  const userToCreate = await User.fromJson(req.body)

  try {
    const createdUser = await createNewUser(userToCreate)

    res.status(201).json({
      status: 'success',
      data: createdUser
    })
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Unable to create new user'
    })
  }
}
