// Constants for the Todo List application

export const PAGE_SIZE = 10;

export const PRIORITY_OPTIONS = [
  { value: 'high', label: 'High' },
  { value: 'medium', label: 'Medium' },
  { value: 'low', label: 'Low' },
] as const;

export const LAYOUT_STYLES = {
  container: { background: 'hsl(var(--background))' },
  header: {
    background: 'hsl(var(--card))',
    padding: '0 24px',
    height: 'auto',
    lineHeight: 'normal',
  },
  content: { padding: '16px 24px' },
  filterCard: {
    background: 'hsl(var(--card))',
    padding: '16px',
    borderRadius: '8px',
  },
} as const;

