import bcrypt from 'bcrypt'
import User from '../models/User.js'

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const sanitizeUser = (user) => ({
  id: user._id,
  username: user.username,
  email: user.email
})

export const signup = async (req, res, next) => {
  try {
    const { username, email, password } = req.body

    if (!username?.trim() || !email?.trim() || !password?.trim()) {
      return res.status(400).json({ error: 'Username, email, and password are required.' })
    }

    if (!EMAIL_REGEX.test(email)) {
      return res.status(400).json({ error: 'Please provide a valid email address.' })
    }

    if (password.length < 8) {
      return res.status(400).json({ error: 'Password must be at least 8 characters long.' })
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() })
    if (existingUser) {
      return res.status(409).json({ error: 'An account with this email already exists.' })
    }

    const hashedPassword = await bcrypt.hash(password, 12)

    const user = await User.create({
      username: username.trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword
    })

    req.session.userId = user._id.toString()

    return res.status(201).json({
      message: 'Signup successful.',
      user: sanitizeUser(user)
    })
  } catch (error) {
    return next(error)
  }
}

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body

    if (!email?.trim() || !password?.trim()) {
      return res.status(400).json({ error: 'Email and password are required.' })
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() })
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password.' })
    }

    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid email or password.' })
    }

    req.session.userId = user._id.toString()

    return res.status(200).json({
      message: 'Login successful.',
      user: sanitizeUser(user)
    })
  } catch (error) {
    return next(error)
  }
}

export const logout = async (req, res, next) => {
  try {
    if (!req.session) {
      return res.status(200).json({ message: 'Logged out.' })
    }

    req.session.destroy((error) => {
      if (error) {
        return next(error)
      }

      res.clearCookie('connect.sid')
      return res.status(200).json({ message: 'Logout successful.' })
    })
  } catch (error) {
    return next(error)
  }
}

export const getSessionUser = async (req, res, next) => {
  try {
    if (!req.session?.userId) {
      return res.status(200).json({ authenticated: false, user: null })
    }

    const user = await User.findById(req.session.userId).select('username email')
    if (!user) {
      req.session.destroy(() => {})
      return res.status(200).json({ authenticated: false, user: null })
    }

    return res.status(200).json({
      authenticated: true,
      user: sanitizeUser(user)
    })
  } catch (error) {
    return next(error)
  }
}

export const getDashboard = async (req, res, next) => {
  try {
    const user = await User.findById(req.session.userId).select('username email')

    if (!user) {
      return res.status(401).json({ error: 'Unauthorized. Please login to continue.' })
    }

    return res.status(200).json({
      message: `Welcome to your dashboard, ${user.username}.`,
      user: sanitizeUser(user)
    })
  } catch (error) {
    return next(error)
  }
}
