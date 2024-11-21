import React, { useState } from 'react';

const ResultsContainer = ({ responseResults }) => {
  const [expandedExerciseId, setExpandedExerciseId] = useState(null); // state to track expanded exercise on hover
  return (
    <div
      id='exerciseContainer'
      className='flex flex-row mt-8 max-w-7xl w-full mx-auto space-x-6'
    >
      {/* LEFT COLUMN: Exercise list */}
      {/* Flex column for vertical stacking with scroll bar, max height, and fixed width */}
      <div className='exerciseList w-[400px] space-y-4 overflow-y-scroll max-h-[400px] bg-black bg-opacity-80 p-4 rounded-lg shadow-md'>
        {responseResults.length > 0 ? (
          <ul className='space-y-4'>
            {responseResults.map((exercise) => (
              // Each list item with hover effects and border styling
              <li
                key={exercise.id}
                className='bg-black bg-opacity-80 text-white border border-orange-500 p-4 rounded-lg shadow-md hover:shadow-lg cursor-pointer'
                onMouseEnter={() => setExpandedExerciseId(exercise.id)}
              >
                {/* Exercise name */}
                <h3 className='text-lg font-bold'>{exercise.name}</h3>
                {/* Exercise image or placeholder */}
                {Array.isArray(exercise.images) ? (
                  <img
                    src={exercise.images[0]}
                    alt={exercise.name}
                    className='w-full h-20 object-cover rounded-md mt-2'
                  />
                ) : (
                  <p className='text-gray-400'>No image available</p>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p className='text-center text-orange-500'>No exercises found</p>
        )}
      </div>

      {/* RIGHT COLUMN: Exercise details */}
      {/* Flex container with grow to fill remaining space */}
      <div className='exerciseDetails bg-black bg-opacity-80 p-6 rounded-lg shadow-md'>
        {expandedExerciseId ? (
          responseResults.map((exercise) =>
            exercise.id === expandedExerciseId ? (
              <div key={exercise.id} className='text-left'>
                {/* Exercise name */}
                <h2 className='text-2xl font-bold text-orange-500 mb-4'>
                  {exercise.name}
                </h2>
                {/* Full image displayed in its container */}
                {Array.isArray(exercise.images) ? (
                  <div className='mb-4'>
                    <img
                      src={exercise.images[0]}
                      alt={`Exercise ${exercise.name}`}
                      className='w-[300px] h-[300px] object-contain mx-auto rounded-md'
                    />
                  </div>
                ) : (
                  <p className='text-gray-400'>No images available</p>
                )}
                {/* Exercise details */}
                <p>
                  <strong>Force:</strong> {exercise.force}
                </p>
                <p>
                  <strong>Level:</strong> {exercise.level}
                </p>
                <p>
                  <strong>Mechanic:</strong> {exercise.mechanic}
                </p>
                <p>
                  <strong>Equipment:</strong> {exercise.equipment}
                </p>
                <p>
                  <strong>Instructions:</strong> {exercise.instructions}
                </p>
              </div>
            ) : null
          )
        ) : (
          <p className='text-center text-gray-400'>Hover over an exercise</p>
        )}
      </div>
    </div>
  );
};

export default ResultsContainer;
