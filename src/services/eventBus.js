const listeners = new Map();

export const EVENT_TYPES = Object.freeze({
  CONTACT_FORM_SUBMITTED: 'CONTACT_FORM_SUBMITTED',
  MESSAGE_PROCESSING_STARTED: 'MESSAGE_PROCESSING_STARTED',
  MESSAGE_PROCESSING_COMPLETED: 'MESSAGE_PROCESSING_COMPLETED',
  MESSAGE_PROCESSING_FAILED: 'MESSAGE_PROCESSING_FAILED',
  REPOSITORIES_FETCH_STARTED: 'REPOSITORIES_FETCH_STARTED',
  REPOSITORIES_FETCH_COMPLETED: 'REPOSITORIES_FETCH_COMPLETED',
  REPOSITORIES_FETCH_FAILED: 'REPOSITORIES_FETCH_FAILED',
});

export function createEventRecord(eventName, status = 'received', description = 'Event emitted', data = {}) {
  return {
    id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
    eventName,
    status,
    description,
    timestamp: new Date().toISOString(),
    data,
  };
}

class EventBus {
  constructor() {
    this.listeners = listeners;
    this.eventHistory = [];
    this.maxHistory = 20;
  }

  on(eventName, callback) {
    if (!eventName || typeof callback !== 'function') {
      return () => {};
    }

    if (!this.listeners.has(eventName)) {
      this.listeners.set(eventName, new Set());
    }

    const eventListeners = this.listeners.get(eventName);
    eventListeners.add(callback);

    return () => this.off(eventName, callback);
  }

  off(eventName, callback) {
    if (!eventName || typeof callback !== 'function') {
      return;
    }

    const eventListeners = this.listeners.get(eventName);
    if (!eventListeners) {
      return;
    }

    eventListeners.delete(callback);
    if (eventListeners.size === 0) {
      this.listeners.delete(eventName);
    }
  }

  once(eventName, callback) {
    const wrapped = (...args) => {
      this.off(eventName, wrapped);
      callback(...args);
    };

    return this.on(eventName, wrapped);
  }

  emit(eventName, payload = {}) {
    if (!eventName) {
      return null;
    }

    const normalized = payload && typeof payload === 'object' && !Array.isArray(payload)
      ? payload
      : { data: payload };

    const record = createEventRecord(
      eventName,
      normalized.status || 'received',
      normalized.description || 'Event emitted',
      normalized.data || normalized,
    );

    this.eventHistory = [record, ...this.eventHistory].slice(0, this.maxHistory);

    const eventListeners = this.listeners.get(eventName);
    if (!eventListeners) {
      return record;
    }

    eventListeners.forEach((callback) => {
      try {
        callback(record);
      } catch (error) {
        console.error(`Event listener failed for ${eventName}:`, error);
      }
    });

    return record;
  }

  getRecentEvents(limit = 20) {
    return this.eventHistory.slice(0, limit);
  }

  clear(eventName) {
    if (eventName) {
      this.listeners.delete(eventName);
      return;
    }

    this.listeners.clear();
  }
}

export const eventBus = new EventBus();
