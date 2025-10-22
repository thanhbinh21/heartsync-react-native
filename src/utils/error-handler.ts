export function handleApiError(error: any): string {
  if (!error) return 'Unknown error occurred';
  
  const message = error.message || String(error);
  
  if (message.includes('401') || message.includes('Unauthorized')) {
    return 'Your session has expired. Please login again.';
  } else if (message.includes('403') || message.includes('Forbidden')) {
    return 'This feature requires a premium subscription.';
  } else if (message.includes('404') || message.includes('Not found')) {
    return 'Resource not found';
  } else if (message.includes('Network') || message.includes('Failed to fetch')) {
    return 'Network error. Please check your connection.';
  } else {
    return message || 'Something went wrong';
  }
}

export function isAuthError(error: any): boolean {
  const message = error?.message || String(error);
  return message.includes('401') || message.includes('Unauthorized') || message.includes('expired');
}
