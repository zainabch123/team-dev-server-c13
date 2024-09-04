import User from '../domain/user.js'
import { sendDataResponse, sendMessageResponse } from '../utils/responses.js'

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
  const { first_name: firstName } = req.query

  let foundUsers

  if (firstName) {
    foundUsers = await User.findManyByFirstName(firstName)
  } else {
    foundUsers = await User.findAll()
  }

  const formattedUsers = foundUsers.map((user) => {
    return {
      ...user.toJSON().user
    }
  })

  return sendDataResponse(res, 200, { users: formattedUsers })
}

export const updateById = async (req, res) => {
  const id = Number(req.params.id)
  const {
    firstName,
    lastName,
    biography: bio,
    githubUrl,
    cohort_id: cohortId
  } = req.body

  try {
    const foundUser = await User.findById(id)

    if (!foundUser) {
      return sendDataResponse(res, 404, { error: 'User not found' })
    }

    if (req.user.id !== id && req.user.role !== 'TEACHER') {
      return res
        .status(403)
        .json({ error: 'Unauthroized Action.' })
    }

    if (req.user.id === id) {
      if (!firstName || !lastName) {
        return sendDataResponse(res, 400, {
          error: 'First name and Last name is required'
        })
      }
      const updateData = {
        firstName,
        lastName,
        ...(bio && { bio }),
        ...(githubUrl && { githubUrl }),
        ...(cohortId && {cohortId})
      }
       const updatedUser = await User.updateUser(id, updateData)
      return sendDataResponse(res, 200, updatedUser)
    }

    // if (req.user.role === 'TEACHER') {
    //   if (!cohortId) {
    //     return sendDataResponse(res, 400, {
    //       error: 'Cohort ID is required'
    //     })
    //   }

    //   const updateData = { cohortId }
    //   const updatedUser = await User.updateUser(id, updateData)
    //   // return sendDataResponse(res, 200, updatedUser)

    //   console.log('Teacher update Data', updateData)
    // }

    // return sendDataResponse(res, 201, { user: { cohort_id: cohortId } })
  } catch (err) {
    console.log('Error', err)
  }
}
