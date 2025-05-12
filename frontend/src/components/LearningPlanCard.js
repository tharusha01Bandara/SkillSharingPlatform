import React, { useState } from 'react';
import api from '../services/api';

const LearningPlanCard = ({ plan, onDelete, onEdit, onUpdate }) => {
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState(false);

  if (!plan) {
  return <div className="text-gray-500">Plan data not available.</div>;
}

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this learning plan?')) {
      setLoading(true);
      try {
        await api.deletePlan(plan.id);
        onDelete(plan.id);
      } catch (error) {
        console.error('Error deleting plan:', error);
        alert('Failed to delete the plan. Please try again.');
      } finally {
        setLoading(false);
      }
    }
  };

  const renderTopics = () => {
    if (!plan.topics) return null;
    return plan.topics.split(',').map((topic, index) => (
      <span
        key={index}
        className="inline-block bg-gradient-to-r from-blue-50 to-indigo-100 text-indigo-800 text-xs font-medium mr-2 mb-2 px-3 py-1 rounded-full border border-indigo-200 shadow-sm"
      >
        {topic.trim()}
      </span>
    ));
  };

  // Format progress - assuming plan has a progress field (0-100)
  const progress = plan.progress || 0;
  const progressColor = 
    progress < 30 ? 'bg-red-500' : 
    progress < 70 ? 'bg-yellow-500' : 
    'bg-green-500';

  return (
    <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden border border-gray-200">
      <div className={`p-6 ${expanded ? 'pb-3' : ''}`}>
        {/* Card Header */}
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-xl font-bold text-gray-800 hover:text-indigo-700 transition-colors duration-200">
            {plan.title}
          </h3>

          <div className="flex space-x-2">
            <button
              onClick={() => onEdit(plan)}
              className="text-gray-500 hover:text-indigo-600 transition-colors duration-200 p-1 rounded-full hover:bg-indigo-50"
              disabled={loading}
              aria-label="Edit plan"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
              </svg>
            </button>

            <button
              onClick={handleDelete}
              className="text-gray-500 hover:text-red-600 transition-colors duration-200 p-1 rounded-full hover:bg-red-50"
              disabled={loading}
              aria-label="Delete plan"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex justify-between text-xs text-gray-600 mb-1">
            <span>Progress</span>
            <span>{progress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className={`${progressColor} h-2 rounded-full transition-all duration-500 ease-out`} 
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        {/* Description */}
        <p className="text-gray-600 mb-4 line-clamp-2">{plan.description}</p>

        {/* Topics */}
        <div className="mb-4">
          <div className="flex flex-wrap">{renderTopics()}</div>
        </div>

        {/* Expandable Content */}
        {expanded && (
          <div className="mt-4 border-t border-gray-100 pt-4 space-y-4 transition-all duration-300">
            {plan.resources && (
              <div>
                <h4 className="font-semibold text-gray-800 mb-1 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  Resources
                </h4>
                <p className="text-gray-600 pl-6">{plan.resources}</p>
              </div>
            )}

            {plan.timeline && (
              <div>
                <h4 className="font-semibold text-gray-800 mb-1 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Timeline
                </h4>
                <p className="text-gray-600 pl-6">{plan.timeline}</p>
              </div>
            )}
          </div>
        )}

        {/* Expand/Collapse Button */}
        <button 
          onClick={() => setExpanded(!expanded)} 
          className="w-full mt-3 text-indigo-600 hover:text-indigo-800 flex items-center justify-center text-sm font-medium transition-colors duration-200 focus:outline-none"
        >
          {expanded ? (
            <React.Fragment>
              <span>Show Less</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
              </svg>
            </React.Fragment>
          ) : (
            <React.Fragment>
              <span>Show More</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </React.Fragment>
          )}
        </button>
      </div>

      {/* Card Footer */}
      <div className="px-6 py-3 bg-gradient-to-r from-indigo-50 to-blue-50 border-t border-gray-200 flex justify-between items-center">
        <div className="flex items-center text-gray-600">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="text-sm">Last updated: {new Date(plan.updatedAt || Date.now()).toLocaleDateString()}</span>
        </div>

        <button className="px-3 py-1 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-full transition-colors duration-200 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Start
        </button>
      </div>
    </div>
  );
};

export default LearningPlanCard;