import { useCallback, useEffect, useRef, useState } from 'react';
import { eventBus, EVENT_TYPES } from '../services/eventBus';
import { fetchGitHubRepositories } from '../services/githubService';
import { useReveal } from '../hooks/useReveal';
import './PortfolioProjects.css';
import './RepositoryCards.css';

function PortfolioProjects() {
  const reveal = useReveal();
  const [repositories, setRepositories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const abortControllerRef = useRef(null);

  const loadRepositories = useCallback(async () => {
    abortControllerRef.current?.abort();
    const controller = new AbortController();
    abortControllerRef.current = controller;

    setLoading(true);
    setError('');
    eventBus.emit(EVENT_TYPES.REPOSITORIES_FETCH_STARTED, {
      status: 'processing',
      description: 'GitHub repositories requested for the portfolio showcase.',
      data: { username: 'MeetKumar6789' },
    });

    try {
      const repos = await fetchGitHubRepositories({ signal: controller.signal });
      if (controller.signal.aborted) return;

      setRepositories(repos);
      eventBus.emit(EVENT_TYPES.REPOSITORIES_FETCH_COMPLETED, {
        status: 'success',
        description: 'Repository data retrieved successfully from the GitHub REST API.',
        data: { total: repos.length, username: 'MeetKumar6789' },
      });
    } catch (requestError) {
      if (requestError.name === 'AbortError') return;

      const message = requestError.message || 'Unable to load GitHub repositories at this time.';
      setError(message);
      eventBus.emit(EVENT_TYPES.REPOSITORIES_FETCH_FAILED, {
        status: 'failed',
        description: 'Repository fetch failed while contacting the GitHub API.',
        data: { error: message },
      });
    } finally {
      if (!controller.signal.aborted) setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadRepositories();
    return () => abortControllerRef.current?.abort();
  }, [loadRepositories]);

  const displayedRepositories = [...repositories]
    .sort((first, second) => new Date(second.updated_at) - new Date(first.updated_at));

  return (
    <section
      className="portfolio-projects"
      id="projects"
      ref={reveal.ref}
      data-reveal={reveal.isObserving ? 'ready' : undefined}
      data-revealed={reveal.isVisible ? 'true' : 'false'}
    >
      <div className="portfolio-projects-container">
        <div className="section-label">
          <span className="label-dot" />
          Selected work / GitHub
        </div>
        <div className="portfolio-projects-heading">
          <h2 className="section-heading">BUILT IN<br />PUBLIC.</h2>
          <p>Recent repositories, fetched live from GitHub.</p>
        </div>

        {loading ? (
          <p className="portfolio-projects-state" role="status">Loading repositories...</p>
        ) : error ? (
          <div className="portfolio-projects-state portfolio-projects-error" role="alert">
            <p>{error}</p>
            <button type="button" onClick={loadRepositories}>Try again</button>
          </div>
        ) : displayedRepositories.length === 0 ? (
          <p className="portfolio-projects-state">No public repositories were found.</p>
        ) : (
          <div className="portfolio-project-grid">
            {displayedRepositories.map((repository, index) => (
              <a
                className="portfolio-project-card repository-card"
                href={repository.html_url}
                key={repository.id}
                target="_blank"
                rel="noreferrer"
              >
                <span className="portfolio-project-number">0{index + 1}</span>
                <span className="portfolio-project-language repository-language">{repository.language}</span>
                <h3 className="repository-title">{repository.name}</h3>
                <p className="repository-description">{repository.description}</p>
                <span className="portfolio-project-link repository-link">
                  View repository <span aria-hidden="true">↗</span>
                </span>
              </a>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default PortfolioProjects;
