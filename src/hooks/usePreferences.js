import { useLocalStorage } from './useLocalStorage';
import { TASK_PRIORITIES } from '../data/taskOptions';

const DEFAULT_PREFERENCES = {
  displayName: 'Prem Kumar',
  theme: 'light',
  defaultPriority: TASK_PRIORITIES[1],
};

export function usePreferences() {
  return useLocalStorage('focusboard_preferences', DEFAULT_PREFERENCES);
}
