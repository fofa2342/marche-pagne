import express from 'express';

const router = express.Router();

router.get('/callback', (req, res) => {
  const { token, returnTo } = req.query;

  if (token) {
    res.cookie('token', token, { 
      httpOnly: true, 
      secure: true, // Use secure cookies in production
      sameSite: 'none', // Allow cross-site cookies
      path: '/', // Cookie available for all paths
      domain: '.vercel.app' // Set domain for sharing across subdomains
    });
    res.redirect(returnTo || '/dashboard');
  } else {
    res.status(400).send('No token provided');
  }
});

export default router;
