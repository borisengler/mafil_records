function removeSeriesFromLocalStorage() {
  const seriesKeys = Object.keys(localStorage).filter((key) => key.startsWith('series-'));
  seriesKeys.forEach((key) => localStorage.removeItem(key));
}

export default removeSeriesFromLocalStorage;
