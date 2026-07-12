import './Skills.css';

function Skills({ skills }) {
  return (
    <section className="skills" id="skills">
      <div className="skills-container">
        <div className="section-label">
          <span className="label-dot"></span>
          Skills & Tools
        </div>
        <h2 className="section-heading">
          Technologies I work with<br />
          <span className="heading-accent">every day</span>
        </h2>

        <div className="skills-grid">
          {skills.map((skill, index) => (
            <div
              className="skill-card"
              key={skill.name}
              style={{ animationDelay: `${index * 0.08}s` }}
            >
              <span className="skill-icon">{skill.icon}</span>
              <span className="skill-name">{skill.name}</span>
              <div className="skill-bar-track">
                <div
                  className="skill-bar-fill"
                  style={{ width: `${skill.level}%` }}
                ></div>
              </div>
              <span className="skill-level">{skill.level}%</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Skills;
