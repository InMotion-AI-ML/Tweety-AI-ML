import express from 'express'; // imports express
import exerciseController from '../controllers/exerciseController.js'; // imports exerciseController module
import exerciseController from '../controllers/aiExerciseController.js'; // imports aiExerciseController module

const router = express.Router(); // imports Router() from Express

router.get('/search', exerciseController.searchExercises); // route searching exercises based on id, muscle, and category

router.get('/unique-values', exerciseController.getUniqueMuscles, exerciseController.getUniqueCategories, (req, res) => {  // route fetches unique muscles and categories
  res.json({ // if both middlewares run without errors, send the response
    muscles: req.uniqueMuscles,
    categories: req.uniqueCategories,
  });
});

router.get('/aisearch', aiExerciseController/*function name to generate a SQL query*/, aiExerciseController/*to create a response*/); // route USING AI to search exercises based on AI ASSISTED QUERY

export default router;
