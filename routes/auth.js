import express from 'express';

const router = express.Router();

router.get('/callback', (req, res) => {
  const { token, returnTo } = req.query;

  if (token) {
    res.cookie('token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });
    res.redirect(returnTo || '/dashboard');
  } else {
    res.status(400).send('No token provided');
  }
});

export default router;
