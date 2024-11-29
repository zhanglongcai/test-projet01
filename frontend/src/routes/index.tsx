import React from 'react';
import { createBrowserRouter } from 'react-router-dom';
import ThesisCheck from '../pages/ThesisCheck';
import ThesisReport from '../pages/ThesisReport';

export const router = createBrowserRouter([
  {
    path: '/thesis/check',
    element: <ThesisCheck />
  },
  {
    path: '/thesis/report/:reportId',
    element: <ThesisReport />
  }
  // ... other routes
]);