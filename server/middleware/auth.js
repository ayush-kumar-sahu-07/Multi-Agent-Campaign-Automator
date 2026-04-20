export const requireAuth = (req, res, next) => {
  if (!req.session?.userId) {
    return res.status(401).json({ error: 'Unauthorized. Please login to continue.' })
  }

  return next()
}
