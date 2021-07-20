import { decycle } from "../vendor/cycle";

const StorageService = {
  /**
   * Persists serializable data to local storage for given key
   *
   * @param {string} key
   * @param {{}} data - serializable data
   */
  save(key, data) {
    try {
      const serializedData = JSON.stringify(decycle(data));
      localStorage.setItem(key, serializedData);
    } catch (e) {
      // TODO: Log errors somewhere
    }
  },

  /**
   * Fetches value from storage for the given key
   *
   * @param {string} key
   * @returns Object - serializable data
   */
  load(key) {
    try {
      const serializedData = localStorage.getItem(key);

      if (serializedData === null) {
        return undefined;
      }

      return JSON.parse(serializedData);
    } catch (e) {
      return undefined;
    }
  },

  /**
   * Deletes value from storage for given key
   *
   * @param {string} key
   */
  delete(key) {
    try {
      localStorage.removeItem(key);
    } catch (e) {
      // TODO: Log errors somewhere
    }
  },
};

export default StorageService;
