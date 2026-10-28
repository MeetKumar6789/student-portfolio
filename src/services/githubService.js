const DEFAULT_USERNAME = 'MeetKumar6789';

function buildGitHubError(response, fallbackMessage) {
  const status = response?.status ?? 'unknown';

  if (status === 403) {
    const resetTime = response.headers.get('x-ratelimit-reset');
    const formattedTime = resetTime
      ? new Date(Number(resetTime) * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      : 'later';

    return new Error(`GitHub API rate limit reached. Please try again after ${formattedTime}.`);
  }

  if (status === 404) {
    return new Error(`GitHub profile for ${DEFAULT_USERNAME} could not be found.`);
  }

  return new Error(fallbackMessage || 'Unable to load repositories from GitHub at this time.');
}

export async function fetchGitHubRepositories({ username = DEFAULT_USERNAME, signal } = {}) {
  const response = await fetch(`https://api.github.com/users/${username}/repos?per_page=100`, {
    method: 'GET',
    signal,
    headers: {
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
    },
  });

  if (!response.ok) {
    throw buildGitHubError(response, `GitHub request failed with status ${response.status}.`);
  }

  const data = await response.json();
  if (!Array.isArray(data)) {
    return [];
  }

  return data
    .filter((repo) => !repo.private)
    .map((repo) => ({
      id: repo.id,
      name: repo.name,
      full_name: repo.full_name,
      description: repo.description || 'No description provided.',
      html_url: repo.html_url,
      stargazers_count: repo.stargazers_count || 0,
      language: repo.language || 'Not specified',
      updated_at: repo.updated_at,
    }));
}
