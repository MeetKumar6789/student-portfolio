import { useState, useEffect } from 'react';
import Skills from './Skills';
import './Projects.css';

const GITHUB_USERNAME = 'definitely-not-a-real-github-user-123456';

function Spinner() {
  return (
    <div className="projects-spinner" role="status" aria-live="polite">
      Loading repositories...
    </div>
  );
}

function ErrorMessage({ message, onRetry }) {
  return (
    <div className="projects-error" role="alert">
      <p>Unable to load repositories right now.</p>
      <p>{message}</p>
      {onRetry && (
        <button type="button" className="retry-button" onClick={onRetry}>
          Retry
        </button>
      )}
    </div>
  );
}

function RepoList({ data, query }) {
  const filteredRepos = data.filter((repo) =>
    repo.name.toLowerCase().includes(query.toLowerCase())
  );

  if (filteredRepos.length === 0) {
    return <p className="no-repos">No repositories match your search.</p>;
  }

  return (
    <div className="repo-list">
      {filteredRepos.map((repo) => (
        <a
          key={repo.id ?? repo.name}
          className="repo-item"
          href={repo.html_url}
          target="_blank"
          rel="noreferrer"
        >
          <div className="repo-topline">
            <span className="repo-name">{repo.name}</span>
            <span className="repo-stars">⭐ {repo.stargazers_count ?? 0}</span>
          </div>
          <span className="repo-link">{repo.html_url}</span>
        </a>
      ))}
    </div>
  );
}

function Projects({ skills }) {
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [query, setQuery] = useState('');

  const loadRepos = () => {
    setLoading(true);
    setError(null);

    fetch(`https://api.github.com/users/${GITHUB_USERNAME}/repos`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`GitHub request failed with status ${response.status}`);
        }

        return response.json();
      })
      .then((data) => {
        setRepos(Array.isArray(data) ? data : []);
      })
      .catch((err) => {
        setError(err.message || 'An unexpected error occurred while fetching repositories.');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    loadRepos();
  }, []);

  return (
    <div className="projects-page">
      <Skills skills={skills} />

      <section className="github-projects" aria-label="GitHub repositories overview">
        <div className="section-label">
          <span className="label-dot"></span>
          GitHub Repositories
        </div>
        <h2 className="section-heading">
          My public work on
          <span className="heading-accent"> GitHub</span>
        </h2>

        {loading ? (
          <Spinner />
        ) : error ? (
          <ErrorMessage message={error} onRetry={loadRepos} />
        ) : (
          <>
            <div className="repo-search-box">
              <label htmlFor="repo-search">Search repositories</label>
              <input
                id="repo-search"
                type="text"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Filter by repository name"
              />
            </div>

            <RepoList data={repos} query={query} />
          </>
        )}
      </section>
    </div>
  );
}

export default Projects;
