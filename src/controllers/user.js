import User from '../domain/User.js'

export const create = (req, res) => {
  const userToCreate = User.fromJson(req.body)

  res.status(201).json({
    status: 'success',
    data: userToCreate
  })
}
