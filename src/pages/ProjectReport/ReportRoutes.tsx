import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ReportGenerator } from './ReportGenerator';
import { ReportTemplates } from './ReportTemplates';
import { ReportHistory } from './ReportHistory';

const ReportRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<ReportGenerator />} />
      <Route path="/templates" element={<ReportTemplates />} />
      <Route path="/history" element={<ReportHistory />} />
    </Routes>
  );
};

export default ReportRoutes;
