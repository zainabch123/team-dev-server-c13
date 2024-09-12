import User from '../domain/user'
import { sendDataResponse, sendMessageResponse } from '../utils/responses'

export const create = async (req, res) => {
  const userToCreate = await User.fromJson(req.body)

  try {
    const existingUser = await User.findByEmail(userToCreate.email)

    if (existingUser) {
      return sendDataResponse(res, 400, { email: 'Email already in use' })
    }

    const createdUser = await userToCreate.save()

    return sendDataResponse(res, 201, createdUser)
  } catch (error) {
    return sendMessageResponse(res, 500, 'Unable to create new user')
  }
}

export const getById = async (req, res) => {
  const id = parseInt(req.params.id)

  try {
    const foundUser = await User.findById(id)

    if (!foundUser) {
      return sendDataResponse(res, 404, { id: 'User not found' })
    }

    return sendDataResponse(res, 200, foundUser)
  } catch (e) {
    return sendMessageResponse(res, 500, 'Unable to get user')
  }
}

export const getAll = async (req, res) => {
  // eslint-disable-next-line camelcase
  const { search } = req.query

  if (!search || !search.trim()) {
    const allUsers = await User.findAll()
    return sendDataResponse(res, 200, { users: allUsers })
  }

  // remove any spaces around query, then split by one or more empty spaces
  const formattedSearch = search.trim().split(/\s+/)

  const foundUsers = await User.findManyByName(formattedSearch)

  const formattedUsers = foundUsers.map((user) => {
    return {
      ...user.toJSON().user
    }
  })

  return sendDataResponse(res, 200, { users: formattedUsers })
}

export const updateById = async (req, res) => {
  const id = Number(req.params.id)
  const { firstName, lastName, bio, githubUrl, cohortId, profilePicture } =
    req.body

  try {
    // Check user you want to update exists:
    const foundUser = await User.findById(id)

    if (!foundUser) {
      return sendDataResponse(res, 404, { error: 'User not found' })
    }

    // Check whether user is authorised
    const canUpdateProfile = req.user.id === id || req.user.role === 'TEACHER'

    if (canUpdateProfile === false) {
      return res
        .status(403)
        .json({ error: 'User not authorized to make this change.' })
    }

    if (req.user.id === id) {
      if (!firstName || !lastName) {
        return sendDataResponse(res, 400, {
          error: 'First name and Last name is required'
        })
      }
    }

    // inject fields if not null in payload
    const updateData = {
      firstName,
      lastName,
      ...(bio && { bio }),
      ...(githubUrl && { githubUrl }),
      ...(profilePicture && { profilePicture })
    }

    if (req.user.role === 'TEACHER') {
      if (!cohortId) {
        return sendDataResponse(res, 400, {
          error: 'Cohort ID is required'
        })
      }

      updateData.cohortId = cohortId
    }
    const updatedUser = await User.updateUser(id, updateData)
    delete updatedUser.password
    return sendDataResponse(res, 201, updatedUser)
  } catch (e) {
    return sendMessageResponse(res, 500, 'Server Error')
  }
}
