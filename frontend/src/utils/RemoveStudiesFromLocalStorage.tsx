function removeStudiesFromLocalStorage() {
    const seriesKeys = Object.keys(localStorage).filter((key) => key.startsWith('study-'));
    seriesKeys.forEach((key) => localStorage.removeItem(key));
}

export default removeStudiesFromLocalStorage;
