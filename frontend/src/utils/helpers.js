export const formatDate = (dateString) => {
  return new Date(dateString).toLocaleString();
};

export const formatBytes = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    console.error('Failed to copy text: ', err);
    return false;
  }
};

export const isValidUrl = (string) => {
  try {
    new URL(string);
    return true;
  } catch (_) {
    return false;
  }
};

export const truncateUrl = (url, maxLength = 50) => {
  return url.length > maxLength ? `${url.substring(0, maxLength)}...` : url;
};

export const calculateAverageClicks = (totalClicks, createdAt) => {
  const daysSinceCreation = Math.ceil(
    (Date.now() - new Date(createdAt).getTime()) / (1000 * 60 * 60 * 24)
  );
  return daysSinceCreation > 0 ? totalClicks / daysSinceCreation : 0;
};
