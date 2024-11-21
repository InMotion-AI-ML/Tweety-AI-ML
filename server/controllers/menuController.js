import db from '../models/exerciseModels.js';

const menuController = {};

// MIDDLEWARE TO FETCH USER PROFILE
menuController.getUserProfile = async (req, res, next) => {
    try {
        const { userId } = req.cookies;
        if (!userId) {
            return res.status(401).json({ error: 'User not authenticated' });
        }

        const query = /* insert db query to access user*/;
        const values = [userId];

        const result = await db.query(query, values);
        if (!result.rows.length) {
            return res.status(404).json({ error: 'User not found' });
        }
        // storing profile data on res.locals
        res.locals.profile = result.rows[0]; 
        return next();
    } catch (err) {
        return next({
            log: 'menuController.getUserProfile: ERROR',
            status: 500,
            message: { err: 'An error occurred while fetching user profile' },
        });
    }
};

// MIDDLEWARE TO LOG OUT THE USER
menuController.logout = (req, res, next) => {
    try {
        // clear authentication cookie
        res.clearCookie('userId');
        res.status(200).json({ message: 'Logout successful' });
    } catch (err) {
        return next({
            log: 'menuController.logout: ERROR',
            status: 500,
            message: { errr: 'An error occurred during logout' },
        });
    }
};

export default menuController;