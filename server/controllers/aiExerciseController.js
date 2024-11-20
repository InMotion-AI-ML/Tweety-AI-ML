import db from '../models/exerciseModels.js';
import OpenAI from 'openai';
import 'dotenv/config';

const openAi = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// need to install openai package: npm install openai dotenv



const aiExerciseController = {};

// TAKES USER INPUT AND MAKES SURE THAT IT'S A STRING/ERROR HANDLING
aiExerciseController.parseNaturalLanguageQuery = async (req, res, next) => {
  // check to see if the user's query exists
  if (!req.body./* natural language query */) {
      const error = {
          log: 'Natural language query not provided',
          status: 400,
          message: { err: 'An error occurred while receiving the inputted query' },
      };
      return next(error);
  }
  
  const { /* natural language query */ } = req.body;
  
  
  if (typeof /* natural language query */ !== 'string') {
      const error = {
          log: 'Natural language query is not a string',
          status: 400,
          message: { err: 'An error occurred while receiving the inputted query' },
      };
      return next(error);
  }
  
  // STORING NATURAL LANGUAGE QUERY (AS USERQUERY) ON RES LOCALS
  res.locals.userQuery = /* natural language query */;
  return next();
};


// TRANSLATES USER INPUT INTO SQL QUERY
aiExerciseController.sqlQueryCreator = async (req, res, next) => {
  const { userQuery } = res.locals;
  if (!userQuery) {
      const error = {
          log: 'SQL query middleware did not receive a query',
          status: 500,
          message: { err: 'An error occurred before querying OpenAI' },
      };
      return next(error);
  }
  try {
      const response = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
        {
          role: 'system',
          content: `Given ${userQuery}, create a SQL query that searches the exercises table by the attributes of id (partial matching able), primaryMuscles, secondaryMuscles, and category.
          id is the same as exercise name.
          Muscle groups include: abdominals, abductors, adductors, biceps, calves, chest, forearms, glutes, hamstrings, lats, lower back, middle back, neck, quadriceps, shoulders, traps, triceps.
          Categories include: cardio, olympic weight lifting, plyometrics, powerlifting, strength, stretching, strongman.
          An example SQL query is: 'SELECT exercises.* FROM exercises WHERE 1=1 AND exercises.id ILIKE $${queryParams.length + 1} AND (exercises."primaryMuscles" @> $${queryParams.length + 1} OR exercises."secondaryMuscles" @> $${queryParams.length + 1})`,
        },
      ],
    });

      const completion = response.choices[0]?.message?.content;

      // STORE COMPLETION ON RES LOCALS AND SEND TO NEXT MIDDLEWARE
      if (completion) {
          res.locals.databaseQuery = `${completion}`;
      } else {
          const error = {
              log: 'OpenAI did not return a completion',
              status: 500,
              message: { err: 'An error occurred while querying OpenAI' },
          };
          return next(error);
      }
      return next();
  } catch (error) {
      const apiError = {
          log: `sqlQueryCreator: Error: OpenAI error`,
          status: 500,
          message: { err: 'An error occurred while '}
      }
  }
}

// MIDDLEWARE TO EXECUTE SQL QUERY

aiExerciseController.queryDatabase = async (req, res, next) => {

  const { databaseQuery } = res.locals;
  try { // execute query and handle response
    const result = await db.query(databaseQuery, queryParams); // execute the query
    res.locals.databaseQueryResult = result.rows;
    console.log(result); // for debugging/looking at the response structure
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'No exercises found' });
    }
    return res.json(result.rows); // return the matching exercises
  } catch (error) {
    console.error('Search error:', error);
    return next({
      log: `Error in exerciseController.searchExercises: ${error}`,
      message: { err: 'Error occurred retrieving exercises.' },
    });
  }
}



// TAKE DB RESULT AND HAVE OPENAI TRANSFORM THAT INFO INTO A RESPONSE
aiExerciseController.openAiResponse = async (req, res, next) => {

  // deconstruct res.locals for query result RENAME VARIABLE TO CONNECT WITH PREVIOUS MIDDLEWARE
  const { dbResponse } = res.locals;

  // deconstruct user input from body
  const userInput = req.body.HOLD/* natural language query REPLACE WITH VARIABLE NAME*/

  if (!dbResponse) {
    const error = {
      log: "openAiResponse not recieve result from database.",
      status: 500,
      message: { error: "Did not recieve valid result from database query."}
    }
    return next(error)
  }
  


  // Make OpenAi request for response 
  
  const systemContent = `
    You are a helpful assistant who is aiding the user in developing a list of exercises and workouts.
    You will receive information from the user regarding what exercises they are looking for, what they are hoping to accomplish, or what activity or sport they want to prepare for.
    You can find this information here: ${userInput}.
    You will also receive a list of specific exercises that fits into the user's goal.
    You can find this information here: ${dbResponse}.
    With these two pieces of information, craft a list of exercises and workouts for the user.
    Be sure to explain how each exercise contributes to their overall goal.
    Make sure your tone is helpful, supportive, and motivational.
  `

  // ask openAI for a message
  try {
    const openAiResponse = await openAi.chat.completions.create({
			model: 'gpt-4o-mini',
			messages: [
				{ role: 'system', content: systemContent },
				{ role: 'user', content: dbResponse },
			]
		})

    // Confirm that OpenAi returned a valid respponse
    if (!openAiResponse.choices[0].message.content) {
      const error = {
        log: "openAiResponse not recieve valid response from OpenAi.",
        status: 500,
        message: { error: "Did not recieve valid output from OpenAi."}
      }
      return next(error)
    }

    // Store openAi message in res.locals
    res.locals.aiResponse = openAiResponse.choices[0].message.content;
    return next();
  } catch (err) {
    const error = {
      log: "Error in openAiResponse middleware",
      status: 500,
      message: {err: error}
    }
    return next(error)
  }
}

export default aiExerciseController;


