import jwt from 'jsonwebtoken';

const authMiddleware = (req, res, next) => {
  const AUTH_SERVICE_URL = process.env.AUTH_SERVICE_URL
  const APP_URL = process.env.APP_URL

  let token = req.cookies.token;

  if (!token) {
    const originalUrl = `${APP_URL}${req.originalUrl}`;
    const redirect_uri = `${APP_URL}/auth/callback?returnTo=${encodeURIComponent(originalUrl)}`;
    return res.redirect(`${AUTH_SERVICE_URL}/users/login?redirect_uri=${encodeURIComponent(redirect_uri)}`);
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.user;
    next();
  } catch (err) {
    // If token is invalid or expired, clear it and redirect to login
    res.clearCookie('token');
    const originalUrl = `${APP_URL}${req.originalUrl}`;
    const redirect_uri = `${APP_URL}/auth/callback?returnTo=${encodeURIComponent(originalUrl)}`;
    return res.redirect(`${AUTH_SERVICE_URL}/users/login?redirect_uri=${encodeURIComponent(redirect_uri)}`);
  }
};

export default authMiddleware;
