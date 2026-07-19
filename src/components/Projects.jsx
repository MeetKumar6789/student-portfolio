import Skills from './Skills';
import './Projects.css';

function Projects({ skills }) {
  return (
    <div className="projects-page">
      <Skills skills={skills} />
    </div>
  );
}

export default Projects;
