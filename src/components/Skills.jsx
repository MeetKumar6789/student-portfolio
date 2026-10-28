import { useReveal } from '../hooks/useReveal';
import './Skills.css';

const categories = [
  { title: 'Frontend', skills: ['HTML', 'CSS', 'JavaScript', 'React', 'Vite'] },
  { title: 'Backend & data', skills: ['Node.js', 'SQL', 'PostgreSQL'] },
  { title: 'Programming', skills: ['Java', 'Python'] },
  { title: 'Data science', skills: ['NumPy', 'Pandas', 'Matplotlib'] },
  { title: 'Tools & workflow', skills: ['GitHub', 'Figma'] },
];

function Skills({ skills }) {
  const skillByName = new Map(skills.map((skill) => [skill.name, skill]));
  const reveal = useReveal();

  return (
    <section className="skills" id="skills">
      <div className="skills-container">
        <div className="section-label">
          <span className="label-dot"></span>
          Stack / Skills
        </div>
        <div className="skills-heading-row">
          <h2 className="section-heading">TOOLS FOR<br />MAKING THINGS.</h2>
          <p>A growing toolkit across the parts of software I enjoy exploring.</p>
        </div>

        <div
          className="skills-grid"
          ref={reveal.ref}
          data-reveal={reveal.isObserving ? 'ready' : undefined}
          data-revealed={reveal.isVisible ? 'true' : 'false'}
        >
          {categories.map((category, index) => (
            <article className={`skill-category skill-category-${index + 1}`} key={category.title}>
              <span className="skill-category-index">0{index + 1} / 05</span>
              <h3>{category.title}</h3>
              <ul>
                {category.skills.map((name) => {
                  const skill = skillByName.get(name);
                  return (
                    <li key={name}>
                      {skill?.icon && <span className="skill-icon" aria-hidden="true">{skill.icon}</span>}
                      <span>{name}</span>
                    </li>
                  );
                })}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Skills;
