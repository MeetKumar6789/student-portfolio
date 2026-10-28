import { useEffect, useState } from 'react';
import { EVENT_TYPES, eventBus } from '../services/eventBus';

export function useEventMonitor(limit = 20) {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const handleEvent = (eventRecord) => {
      setEvents((previousEvents) => [eventRecord, ...previousEvents].slice(0, limit));
    };

    setEvents(eventBus.getRecentEvents(limit));

    const eventNames = Object.values(EVENT_TYPES);
    eventNames.forEach((eventName) => eventBus.on(eventName, handleEvent));

    return () => {
      eventNames.forEach((eventName) => eventBus.off(eventName, handleEvent));
    };
  }, [limit]);

  return events;
}
 