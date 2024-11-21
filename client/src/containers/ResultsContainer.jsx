import React, { useState } from 'react';

const ResultsContainer = ({ responseResults }) => {
  const [expandedExerciseId, setExpandedExerciseId] = useState(null); // state to track expanded exercise on hover

  return (
    <div className='resultsContainer'>
      <div id='searchResults' className='resultsContainer'>
        {responseResults.length > 0 ? ( // if there is 1 or more results in the responseResults array
          <ul>
            {responseResults.map(
              (
                exercise // map the array, a list item for each element
              ) => (
                <li key={exercise.id}>
                  <h3>{exercise.name}</h3>
                  {Array.isArray(exercise.images) ? (
                    exercise.images.map((imageUrl, index) => (
                      // eslint-disable-next-line jsx-a11y/img-redundant-alt
                      <img
                        key={index}
                        src={imageUrl}
                        alt={`Exercise Image ${index + 1}`}
                        style={{
                          maxWidth: '20%',
                          height: 'auto',
                          marginBottom: '10px',
                        }} // style the images if needed
                      />
                    ))
                  ) : (
                    <p>No images available</p> // Fallback if `exercise.images` isn't an array
                  )}
                  <button
                    onMouseEnter={() => setExpandedExerciseId(exercise.id)}
                    onMouseLeave={() => setExpandedExerciseId(null)}
                  >
                    Hover to Expand
                  </button>
                  {expandedExerciseId === exercise.id && (
                    <div className='expandedDetails'>
                      <p>Force: {exercise.force}</p>
                      <p>Level: {exercise.level}</p>
                      <p>Mechanic: {exercise.mechanic}</p>
                      <p>Equipment: {exercise.equipment}</p>
                      <p>Instructions: {exercise.instructions}</p>
                    </div>
                  )}
                </li> // each list item has the specified info from the db row/entry
              )
            )}
          </ul>
        ) : (
          // if no results returned, display the <p>/string
          <p>Please search for an exercise</p>
        )}
      </div>
    </div>
  );
};

export default ResultsContainer;
