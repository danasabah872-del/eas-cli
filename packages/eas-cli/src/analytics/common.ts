import { Analytics, AnalyticsEvent, AnalyticsEventProperties } from './AnalyticsManager';

/**
 * A helper function that wraps a function with analytics events.
 * @param analytics The analytics instance to use.
 * @param fn The function to wrap.
 * @param attemptEvent The event to log when the function is attempted.
 * @param successEvent The event to log when the function succeeds.
 * @param failureEvent The event to log when the function fails.
 * @param properties The properties to log with the events.
 * @returns The result of the wrapped function.
 */
export async function withAnalyticsAsync<Result>(
  analytics: Analytics,
  fn: () => Promise<Result>,
  {
    attemptEvent,
    successEvent,
    failureEvent,
    properties,
  }: {
    attemptEvent: AnalyticsEvent;
    successEvent: AnalyticsEvent;
    failureEvent: AnalyticsEvent;
    properties: AnalyticsEventProperties;
  }
): Promise<Result> {
  try {
    analytics.logEvent(attemptEvent, properties);
    const result = await fn();
    analytics.logEvent(successEvent, properties);
    return result;
  } catch (error: any) {
    analytics.logEvent(failureEvent, {
      ...properties,
      reason: error.message,
    });
    throw error;
  }
}
