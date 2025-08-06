import React from 'react'

function ProjectsPreview({ resumeInfo }) {
  return (
    <div className='my-6'>
      <h2
        className='text-center font-bold text-sm mb-2'
        style={{ color: resumeInfo?.themeColor }}
      >
        Projects
      </h2>
      <hr style={{ borderColor: resumeInfo?.themeColor }} />

      {resumeInfo?.projects?.map((project, index) => (
        <div key={index} className='my-5'>
          <h2
            className='text-sm font-bold'
            style={{ color: resumeInfo?.themeColor }}
          >
            {project.title}
          </h2>
          <p className='text-xs my-2'>{project.description}</p>
        </div>
      ))}
    </div>
  )
}

export default ProjectsPreview
