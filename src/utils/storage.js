const KEY = "travelWishlist";

export const getDestinations = () => {
  try {
    const stored = localStorage.getItem(KEY);
    if (!stored) return [];
    const parsed = JSON.parse(stored);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

export const addDestination = (destination) =>
  localStorage.setItem(KEY, JSON.stringify([...getDestinations(), destination]));

export const updateDestination = (updated) =>
  localStorage.setItem(
    KEY,
    JSON.stringify(
      getDestinations().map((d) => (d.id === updated.id ? updated : d))
    )
  );

export const deleteDestination = (id) =>
  localStorage.setItem(
    KEY,
    JSON.stringify(getDestinations().filter((d) => d.id !== id))
  );
