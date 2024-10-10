import { useState } from "react";

/**
 * SortByPrice component allows users to sort products by price.
 *
 * @component
 * @param {Object} props - The component's props.
 * @param {Function} props.onSort - Callback function triggered when sorting is applied.
 * It receives the sort order ('asc' or 'desc') as an argument.
 *
 * @example
 * <SortByPrice onSort={(order) => console.log(order)} />
 */
export default function SortByPrice({ onSort }) {
  const [sortOrder, setSortOrder] = useState("");

  /**
   * Handles the change in the sorting order and updates the state.
   * Calls the onSort callback with the selected sorting order.
   *
   * @param {Object} e - The event object from the select input.
   */
  const handleSortChange = (e) => {
    const selectedSort = e.target.value;
    setSortOrder(selectedSort);
    onSort(selectedSort);
  };

  return (
    <div className="flex justify-center lg:justify-end mb-4">
      <label htmlFor="sort-price" className="mr-2 text-gray-700">
        Sort by Price:
      </label>
      <select
        id="sort-price"
        value={sortOrder}
        onChange={handleSortChange}
        className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-300"
      >
        <option value="">Select</option>
        <option value="asc">Low to High</option>
        <option value="desc">High to Low</option>
      </select>
    </div>
  );
}
