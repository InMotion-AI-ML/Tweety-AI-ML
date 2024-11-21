import db from '../models/exerciseModels.js';
import OpenAI from 'openai';
import 'dotenv/config';

const openAi = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const aiExerciseController = {};

// TAKES USER INPUT AND MAKES SURE THAT IT'S A STRING/ERROR HANDLING
aiExerciseController.parseNaturalLanguageQuery = async (req, res, next) => {
  // check to see if the user's query exists
  if (!req.body.searchAI) {
      const error = {
          log: 'Natural language query not provided',
          status: 400,
          message: { err: 'An error occurred while receiving the inputted query' },
      };
      return next(error);
  }
  
  const { searchAI } = req.body;
    
  if (typeof searchAI !== 'string') {
      const error = {
          log: 'Natural language query is not a string',
          status: 400,
          message: { err: 'An error occurred while receiving the inputted query' },
      };
      return next(error);
  }
  
  // STORING NATURAL LANGUAGE QUERY (AS USERQUERY) ON RES LOCALS
  res.locals.userQuery = searchAI;
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
  const queryParams = [];

  console.log('Generated SQL query:', res.locals.databaseQuery);

  if (!databaseQuery) {
    const error = {
      log: 'Database query middleware did not receive a query',
      status: 500,
      message: { err: 'An error occurred before querying the database' },
    };
    return next(error);
  }

  if (!databaseQuery.startsWith('SELECT')) {
    const error = {
      log: 'Database query middleware received a non-SELECT query',
      status: 500,
      message: { err: 'An error occurred before querying the database' },
    };
    return next(error);
  }

  // EXECUTE QUERY AND HANDLE RESPONSE
  try { 
      // execute the query
      const result = await db.query(databaseQuery);
      if (result.rows.length === 0) {
        return res.status(404).json({ message: 'No exercises found' });
      }
      res.locals.dbResponse = result.rows;
      console.log('Database query result:', res.locals.dbResponse) // log the matching exercises
      return next(); // pass the matching exercises to next middleware
  } catch (err) {
    const error = {
      log: 'Database query received an invalid query',
      status: 500,
      message: { err: 'An error occurred while querying database' },
    };
    return next(error); 
  }
}

;// TAKE DB RESULT AND HAVE OPENAI TRANSFORM THAT INFO INTO A RESPONSE
aiExerciseController.openAiResponse = async (req, res, next) => {
  // deconstruct res.locals for query result
  const { dbResponse } = res.locals;
  // take user input
  const userInput = res.locals.userQuery;

  if (!dbResponse) {
    const error = {
      log: "openAiResponse not recieve result from database.",
      status: 500,
      message: { error: "Did not recieve valid result from database query."}
    }
 ;   return next(error)
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

