export const handleCategoryDelete = async (endpoint) => {
  const confirmDelete = confirm("Are you sure you want to delete this data?");
  if (!confirmDelete) return false;

  try {
    const res = await fetch(endpoint, {
      method: 'DELETE',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    const data = await res.json();

    if (res.ok) {
      return data;
    } else {
      return false;
    }

  } catch (error) {
    console.error("Error deleting category:", error);
    return false;
  }
};
