const USERS_KEY = 'boho_users'

export const DEMO_USER = {
  idUser: 1,
  name: 'Usuario demo',
  email: 'demo@alma.com',
  password: 'demo123',
  role: 'ROLE_USER',
}

export const DEMO_ADMIN = {
  idUser: 99,
  name: 'Admin demo',
  email: 'admin@alma.com',
  password: 'admin123',
  role: 'ROLE_ADMIN',
}

const readUsers = () => {
  try {
    const saved = localStorage.getItem(USERS_KEY)
    return saved ? JSON.parse(saved) : []
  } catch {
    return []
  }
}

const writeUsers = (users) => {
  localStorage.setItem(USERS_KEY, JSON.stringify(users))
}

const buildSession = (user) => ({
  idUser: user.idUser,
  email: user.email,
  name: user.name,
  role: user.role ?? 'ROLE_USER',
  token: `local-${user.idUser}-${Date.now()}`,
})

export const loginLocal = (email, password) => {
  const normalizedEmail = email.trim().toLowerCase()

  if (
    normalizedEmail === DEMO_USER.email &&
    password === DEMO_USER.password
  ) {
    return buildSession(DEMO_USER)
  }

  if (
    normalizedEmail === DEMO_ADMIN.email &&
    password === DEMO_ADMIN.password
  ) {
    return buildSession(DEMO_ADMIN)
  }

  const match = readUsers().find(
    (user) => user.email === normalizedEmail && user.password === password,
  )

  if (!match) {
    throw new Error('Email o contrasena incorrectos')
  }

  return buildSession(match)
}

export const registerLocal = (name, email, password) => {
  const normalizedEmail = email.trim().toLowerCase()
  const users = readUsers()

  if (
    normalizedEmail === DEMO_USER.email ||
    users.some((user) => user.email === normalizedEmail)
  ) {
    throw new Error('Ya existe una cuenta con ese email')
  }

  const newUser = {
    idUser: Date.now(),
    name: name.trim(),
    email: normalizedEmail,
    password,
    role: 'ROLE_USER',
  }

  writeUsers([...users, newUser])
  return buildSession(newUser)
}
