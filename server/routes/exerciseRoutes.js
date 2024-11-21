import express from 'express';
import exerciseController from '../controllers/exerciseController.js';
import aiExerciseController from '../controllers/aiExerciseController.js';

const router = express.Router(); // imports Router() from Express

router.get('/search', exerciseController.searchExercises); // route searching exercises based on id, muscle, and category

router.get(
	'/unique-values',
	exerciseController.getUniqueMuscles,
	exerciseController.getUniqueCategories,
	(req, res) => {
		// route fetches unique muscles and categories
		res.json({
			// if both middlewares run without errors, send the response
			muscles: req.uniqueMuscles,
			categories: req.uniqueCategories,
		});
	}
);

// HANDLES THE AI SEARCHING FUNCTIONALITY
router.post(
	'/aisearch',
	aiExerciseController.parseNaturalLanguageQuery,
	aiExerciseController.sqlQueryCreator,
	aiExerciseController.queryDatabase,
	aiExerciseController.openAiResponse,
	(req, res) => {
		// sends AI-generated response to frontend
		res.status(200).json({ aiResponse: res.locals.aiResponse });
	}
);

export default router;
