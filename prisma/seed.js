import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

async function seed() {
  const cohort = await createCohort()

  const student = await createUser(
    'student@test.com',
    'Testpassword1!',
    cohort.id,
    'Joe',
    'Bloggs',
    'Hello, world!',
    'student1'
  )

  const teacher = await createUser(
    'teacher@test.com',
    'Testpassword1!',
    null,
    'Rick',
    'Sanchez',
    'Hello there!',
    'teacher1',
    'TEACHER'
  )

  await createPost(student.id, 'My first post!')
  await createPost(teacher.id, 'Hello, students')

  // Now seed modules, units, exercises, and grades
  await seedModulesAndGrades(student.id)

  process.exit(0)
}

async function createPost(userId, content) {
  const post = await prisma.post.create({
    data: {
      userId,
      content
    },
    include: {
      user: true
    }
  })

  console.info('Post created', post)
  return post
}

async function createCohort() {
  const cohort = await prisma.cohort.create({
    data: {
      startDate: new Date('2023-01-05T00:00:00Z'),
      endDate: new Date('2023-06-25T00:00:00Z')
    }
  })

  console.info('Cohort created', cohort)
  return cohort
}

async function createUser(
  email,
  password,
  cohortId,
  firstName,
  lastName,
  bio,
  githubUrl,
  role = 'STUDENT'
) {
  const user = await prisma.user.create({
    data: {
      email,
      password: await bcrypt.hash(password, 8),
      role,
      cohortId,
      profile: {
        create: {
          firstName,
          lastName,
          bio,
          githubUrl
        }
      }
    },
    include: {
      profile: true
    }
  })

  console.info(`${role} created`, user)
  return user
}

async function seedModulesAndGrades(userId) {
  const module1 = await prisma.module.create({
    data: {
      name: 'Module 1',
      description: 'Description for Module 1',
      units: {
        create: [
          {
            name: 'Unit 1',
            description: 'Description for Unit 1',
            exercises: {
              create: [
                {
                  name: 'Exercise 1',
                  description: 'Description for Exercise 1'
                },
                {
                  name: 'Exercise 2',
                  description: 'Description for Exercise 2'
                }
              ]
            }
          },
          {
            name: 'Unit 2',
            description: 'Description for Unit 2',
            exercises: {
              create: [
                {
                  name: 'Exercise 3',
                  description: 'Description for Exercise 3'
                },
                {
                  name: 'Exercise 4',
                  description: 'Description for Exercise 4'
                }
              ]
            }
          }
        ]
      }
    }
  })

  const module2 = await prisma.module.create({
    data: {
      name: 'Module 2',
      description: 'Description for Module 2',
      units: {
        create: [
          {
            name: 'Unit 3',
            description: 'Description for Unit 3',
            exercises: {
              create: [
                {
                  name: 'Exercise 5',
                  description: 'Description for Exercise 5'
                },
                {
                  name: 'Exercise 6',
                  description: 'Description for Exercise 6'
                },
                {
                  name: 'Exercise 7',
                  description: 'Description for Exercise 7'
                }
              ]
            }
          }
        ]
      }
    }
  })

  const module3 = await prisma.module.create({
    data: {
      name: 'Module 3',
      description: 'Description for Module 3',
      units: {
        create: [
          {
            name: 'Unit 4',
            description: 'Description for Unit 4',
            exercises: {
              create: [
                {
                  name: 'Exercise 8',
                  description: 'Description for Exercise 8'
                },
                {
                  name: 'Exercise 9',
                  description: 'Description for Exercise 9'
                },
                {
                  name: 'Exercise 10',
                  description: 'Description for Exercise 10'
                }
              ]
            }
          },
          {
            name: 'Unit 5',
            description: 'Description for Unit 5',
            exercises: {
              create: [
                {
                  name: 'Exercise 11',
                  description: 'Description for Exercise 11'
                }
              ]
            }
          }
        ]
      }
    }
  })

  const exercises = await prisma.exercise.findMany({
    where: {
      unit: {
        module: {
          id: { in: [module1.id, module2.id, module3.id] }
        }
      }
    }
  })

  await prisma.grade.createMany({
    data: exercises.map((exercise) => ({
      exerciseId: exercise.id,
      userId: userId,
      grade: Math.floor(Math.random() * 51) + 50,
      completedAt: new Date()
    }))
  })
}

seed().catch(async (e) => {
  console.error(e)
  await prisma.$disconnect()
  process.exit(1)
})
