import db from '../models/exerciseModels.js';
import OpenAI from 'openai';
import 'dotenv/config';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const aiExerciseController = {};

// TAKES USER INPUT AND MAKES SURE THAT IT'S A STRING/ERROR HANDLING
aiExerciseController.parseNaturalLanguageQuery = async (req, res, next) => {
  console.log('Parsenaturallanguagequery START');
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
  console.log('parsenaturallanguagequery END');
  return next();
};

// TRANSLATES USER INPUT INTO SQL QUERY
aiExerciseController.sqlQueryCreator = async (req, res, next) => {
  console.log('sqlQueryCreator START');
  const { userQuery } = res.locals;
  if (!userQuery) {
    const error = {
      log: 'SQL query middleware did not receive a query',
      status: 500,
      message: { err: 'An error occurred before querying OpenAI' },
    };
    return next(error);
  }

  const queryParams = [];

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: `Based on the user query "${userQuery}", generate one legal SQL query to search the "exercises" table. 
          Muscle groups include: abdominals, abductors, adductors, biceps, calves, chest, forearms, glutes, hamstrings, lats, lower back, middle back, neck, quadriceps, shoulders, traps, triceps.
          Example userQuery: "I want to work on my quads", Example SQL: SELECT exercises.* FROM exercises WHERE 1 = 1 and exercises.id ILIKE '%squat%' AND 'quadriceps' = ANY (exercises."primaryMuscles")
          Example userQuery: "I want to jump higher", Example SQL: SELECT exercises.* FROM exercises WHERE 1 = 1 and exercises.id ILIKE '%calf%' AND 'calves' = ANY (exercises."primaryMuscles")
          Example userQuery: "I want to get better at pitching", Example SQL: SELECT exercises.* FROM exercises WHERE 1 = 1 and exercises.id ILIKE '%internal%' AND 'shoulders' = ANY (exercises."primaryMuscles")
          This is very important - no matter what, DO NOT wrap the legal query in any symbols or extra text.;`
        },
        //  AND exercises.category = 'strength'

        // `Based on the user query "${userQuery}", generate a SQL query to search the "exercises" table. 
        //   - The table has columns: "id" (partial matching), "primaryMuscle", and "category".
        //   - Only use one muscle and one category per SQL query.
        //   Example SQL:
        //   SELECT exercises.* 
        //   FROM exercises 
        //   WHERE 1=1 
        //   AND exercises.id $${queryParams.length + 1} 
        //   AND exercises."primaryMuscle" $${queryParams.length + 1} 
        //   Muscle groups include: abdominals, abductors, adductors, biceps, calves, chest, forearms, glutes, hamstrings, lats, lower back, middle back, neck, quadriceps, shoulders, traps, triceps.
        //   Categories include: cardio, olympic weight lifting, plyometrics, powerlifting, strength, stretching, strongman.
        //   Make sure to ONLY return a LEGAL SQL QUERY, do not provide any reasoning or additional text.
        //   This is very important - no matter what, DO NOT wrap the legal query in any symbols or extra text.`,

        // - Generate a well-rounded selection of exercises if specific columns are not provided in the query.
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
    console.log('sqlQueryCreator END');
    return next();
  } catch (error) {
    const apiError = {
      log: `sqlQueryCreator: Error: OpenAI error`,
      status: 500,
      message: { err: 'An error occurred while ' },
    };
    return next(apiError);
  }
};

// MIDDLEWARE TO EXECUTE SQL QUERY
aiExerciseController.queryDatabase = async (req, res, next) => {
  console.log('queryDatabase START');
  const { databaseQuery } = res.locals;

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
    const queryWithLimit = `${databaseQuery} LIMIT 6`; // limit query to 6 results with `LIMIT 6` clause
    const result = await db.query(queryWithLimit);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'No exercises found' });
    }
    res.locals.dbResponse = result.rows;
    console.log('Database query result:', res.locals.dbResponse); // log the matching exercises
    return next(); // pass the matching exercises to next middleware
  } catch (err) {
    const error = {
      log: 'Database query received an invalid query',
      status: 500,
      message: { err: err },
    };
    return next(error);
  }
}; // TAKE DB RESULT AND HAVE OPENAI TRANSFORM THAT INFO INTO A RESPONSE
aiExerciseController.openAiResponse = async (req, res, next) => {
  console.log('openAiResponse START');
  // deconstruct res.locals for query result
  const { dbResponse } = res.locals;
  // take user input
  const userInput = res.locals.userQuery;

  if (!dbResponse) {
    const error = {
      log: 'openAiResponse not recieve result from database.',
      status: 500,
      message: { error: 'Did not recieve valid result from database query.' },
    };
    return next(error);
  }

  const dbResponseData = dbResponse.map((exerciseObj) => {
    return exerciseObj.name;
  });

  // Make OpenAi request for response
  const systemContent = `
          You are a helpful assistant who is aiding the person in developing a list of exercises and workouts.
          You will receive information from this person regarding what exercises they are looking for, what they are hoping to accomplish, or what activity or sport they want to prepare for. That information is provided here: ${userInput}.
          From this search, the database returned the following ${JSON.stringify(dbResponseData, null, 2)}.
          In the first person:
          - Choose the 3 most relevant and describe how each recommendation relates to the person's search in at most 2-3 sentences each.
          - Provide a summary of how all exercises relate to the person's search in at most 5 sentences.
  `;
  // - Express confidence in the recommendation as a percentage.

  //   You are a helpful assistant who is aiding the user in developing a list of exercises and workouts.
  //   You will receive information from the user regarding what exercises they are looking for, what they are hoping to accomplish, or what activity or sport they want to prepare for.
  //   You can find this information here: ${userInput}.
  //   You will also receive a list of specific exercises that fits into the user's goal.
  //   You can find this information here: ${dbResponse}.
  //   With these two pieces of information, craft a list of exercises and workouts for the user.
  //   Be sure to explain how each exercise contributes to their overall goal.
  //   Make sure your tone is helpful, supportive, and motivational.
  // `;

  // ask openAI for a message
  try {
    const openAiResponse = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        { role: 'system', content: systemContent },
        // { role: 'user', content: dbResponse },
      ],
    });

    // Confirm that OpenAi returned a valid respponse
    if (!openAiResponse.choices[0].message.content) {
      const error = {
        log: 'openAiResponse not recieve valid response from OpenAi.',
        status: 500,
        message: { error: 'Did not recieve valid output from OpenAi.' },
      };
      return next(error);
    }

    console.time('AI Query Time'); // captures execution times for AI query generation and database querying
    // Store openAi message in res.locals
    res.locals.aiResponse = openAiResponse.choices[0].message.content;
    console.timeEnd('AI Query Time');

    console.log('response:', res.locals.aiResponse);
    return next();
  } catch (err) {
    const error = {
      log: 'Error in openAiResponse middleware',
      status: 500,
      message: { err: err },
    };
    return next(error);
  }
};

export default aiExerciseController;
