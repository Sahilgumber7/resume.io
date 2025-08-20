import React from 'react';

function ExperiencePreview({ resumeInfo }) {
  return (
    <div className="my-6">
      <h2
        className="text-center font-bold text-sm mb-2"
        style={{ color: resumeInfo?.themeColor }}
      >
        Professional Experience
      </h2>
      <hr style={{ borderColor: resumeInfo?.themeColor }} />

      {resumeInfo?.experience?.map((experience, index) => (
        <div key={index} className="my-5">
          {/* Job Title */}
          <h2
            className="text-sm font-bold"
            style={{ color: resumeInfo?.themeColor }}
          >
            {experience?.title}
          </h2>

          {/* Company + Location + Dates */}
          <h2 className="text-xs flex justify-between">
            <span>
              {experience?.companyName}, {experience?.city}, {experience?.state}
            </span>
            <span>
              {experience?.startDate} to{' '}
              {experience?.currentlyWorking ? 'Present' : experience?.endDate}
            </span>
          </h2>

          {/* Work Summary (render HTML) */}
          <div
            className="text-xs my-2"
            dangerouslySetInnerHTML={{ __html: experience?.worksummary }}
          />
        </div>
      ))}
    </div>
  );
}

export default ExperiencePreview;
