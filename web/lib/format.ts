export const formatDateTime = (value?: string | null): string => {
  if (!value) return '—';
  return new Date(value).toLocaleString(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  });
};

export const formatCoords = (
  lat?: number | null,
  lng?: number | null
): string => {
  if (lat == null || lng == null) return 'Not set';
  return `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
};