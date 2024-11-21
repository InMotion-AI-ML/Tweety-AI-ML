import express from 'express';
import menuController from '../controllers/menuController.js';

const router = express.Router();

// Route to get user profile data
router.get('/profile', menuController.getUserProfile, (req, res) => {
  return res.status(200).json(res.locals.profile);
});

// Route to handle logout
router.get('/logout', menuController.logout);

export default router;

////////

// ADD THE FOLLOWING CODE OR SOMETHING SIMILAR TO MENU.JSX FOR PROFILES:

// useEffect(() => {
//     fetch('http://localhost:8080/api/menu/profile', {
//       credentials: 'include', // Include cookies for auth
//     })
//       .then((res) => res.json())
//       .then((data) => {
//         console.log('Profile data:', data);
//         // Update state with profile info here
//       })
//       .catch((err) => console.error('Error fetching profile:', err));
//   }, []);

////////