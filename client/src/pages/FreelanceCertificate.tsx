import React from 'react';
import DashboardLayout from '@/components/DashboardLayout';

const FreelanceCertificate: React.FC = () => {
  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-8 flex flex-col items-center justify-center min-h-[60vh]">
        <div className="max-w-4xl w-full bg-card border border-border rounded-2xl p-4 shadow-2xl overflow-hidden">
          <iframe 
            src="https://image2url.com/r2/default/documents/1772538544016-d43aa3aa-0d5d-4cd5-9483-5b076a97e8ac.pdf" 
            className="w-full h-[800px] rounded-xl"
            title="Freelance Certificate"
          />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default FreelanceCertificate;
