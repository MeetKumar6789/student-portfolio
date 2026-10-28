import { useEventMonitor } from '../hooks/useEventMonitor';
import { useReveal } from '../hooks/useReveal';
import './EventMonitor.css';

function formatTime(timestamp) {
  if (!timestamp) {
    return '—';
  }

  return new Date(timestamp).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
}

function EventMonitor() {
  const events = useEventMonitor(20);
  const reveal = useReveal();

  return (
    <section
      className="event-monitor-section"
      aria-live="polite"
      ref={reveal.ref}
      data-reveal={reveal.isObserving ? 'ready' : undefined}
      data-revealed={reveal.isVisible ? 'true' : 'false'}
    >
      <div className="section-label">
        <span className="label-dot" />
        Event Monitor
      </div>
      <h2 className="section-heading">
        Live Event
        <span className="heading-accent"> Dashboard</span>
      </h2>

      <div className="event-monitor-card">
        <div className="event-monitor-meta">
          <span>Recent events: {events.length}</span>
          <span>Max entries: 20</span>
        </div>

        {events.length === 0 ? (
          <div className="event-table-empty">
            No events have been emitted yet. Submit the contact form or fetch repositories to populate the monitor.
          </div>
        ) : (
          <table className="event-monitor-table">
            <thead>
              <tr>
                <th>Event</th>
                <th>Timestamp</th>
                <th>Status</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              {events.map((event) => (
                <tr key={event.id || `${event.eventName}-${event.timestamp}`}>
                  <td>{event.eventName}</td>
                  <td>{formatTime(event.timestamp)}</td>
                  <td>
                    <span className={`event-pill ${event.status || 'received'}`}>
                      {event.status || 'received'}
                    </span>
                  </td>
                  <td>{event.description || 'No additional description.'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </section>
  );
}

export default EventMonitor;
