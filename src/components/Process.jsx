import { useReveal } from '../hooks/useReveal';
import './Process.css';

const stages = [
  {
    number: '01',
    title: 'Discover',
    description: 'Clarify the problem, define the goals, and understand the people who will use the product.',
  },
  {
    number: '02',
    title: 'Design',
    description: 'Shape the experience and plan a clear structure before choosing how to build it.',
  },
  {
    number: '03',
    title: 'Build',
    description: 'Develop the interface, backend, and integrations in focused, testable steps.',
  },
  {
    number: '04',
    title: 'Test',
    description: 'Check the important flows, responsive layouts, and edge cases before release.',
  },
  {
    number: '05',
    title: 'Deploy',
    description: 'Prepare the application for its environment and verify the finished experience.',
  },
];

function Process() {
  const reveal = useReveal();

  return (
    <section
      className="process-section"
      id="process"
      ref={reveal.ref}
      data-reveal={reveal.isObserving ? 'ready' : undefined}
      data-revealed={reveal.isVisible ? 'true' : 'false'}
    >
      <div className="process-container">
        <div className="section-label">
          <span className="label-dot" />
          How I work
        </div>
        <div className="process-heading-row">
          <h2 className="section-heading">MY PROCESS</h2>
          <p>From the first question to a considered, working result.</p>
        </div>
        <div className="process-list">
          {stages.map((stage) => (
            <article className="process-stage" key={stage.number}>
              <span className="process-number">{stage.number}</span>
              <h3>{stage.title}</h3>
              <p>{stage.description}</p>
              <span className="process-arrow" aria-hidden="true">↗</span>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Process;
