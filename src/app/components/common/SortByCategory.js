import { useState, useEffect } from "react";

/**
 * SortByCategory component allows users to sort products by their categories.
 *
 * @component
 * @param {Object} props - The component's props.
 * @param {Function} props.onSort - Callback function triggered when a category is selected.
 * It receives the selected category as an argument.
 *
 * @example
 * <SortByCategory onSort={(category) => console.log(category)} />
 */
export default function SortByCategory({ onSort }) {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");

  /**
   * Fetches categories from an external API and updates the state.
   * Catches and logs any errors encountered during the fetch.
   *
   * @async
   * @function
   */

  const fetchCategories = async () => {
    try {
      const res = await fetch(
        "https://next-ecommerce-api.vercel.app/categories"
      );
      const data = await res.json();
      setCategories(data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  /**
   * Handles the change in selected category and updates the state.
   * Calls the onSort callback with the selected category.
   *
   * @param {Object} e - The event object from the select input.
   */

  const handleSort = (e) => {
    const selected = e.target.value;
    setSelectedCategory(selected);
    onSort(selected);
  };

  return (
    <div className="flex justify-center mb-6">
      <div className="relative w-full max-w-md">
        <select
          value={selectedCategory}
          onChange={handleSort}
          className="w-full px-4 py-2 border rounded-md"
        >
          <option value="">Sort by Category</option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
