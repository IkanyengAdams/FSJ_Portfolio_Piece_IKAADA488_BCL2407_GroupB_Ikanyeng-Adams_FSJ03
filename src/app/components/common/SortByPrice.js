import { useState, useEffect } from "react";
import { collection, query, orderBy, getDocs } from "firebase/firestore";
import { db } from "../../../../lib/firebase";

export default function SortByPrice({ onSort }) {
  const [sortOrder, setSortOrder] = useState("");

  /**
   * Handles the change in the sorting order and updates the state.
   * Calls the onSort callback with the selected sorting order.
   * Fetches products from Firestore based on the sorting order.
   *
   * @param {Object} e - The event object from the select input.
   */
  const handleSortChange = (e) => {
    const selectedSort = e.target.value;
    setSortOrder(selectedSort);
    onSort(selectedSort);
  };

  useEffect(() => {
    if (sortOrder) {
      const fetchSortedProducts = async () => {
        try {
          

          

          onSort(sortedProducts);
        } catch (error) {
          console.error("Error fetching sorted products:", error);
        }
      };

      fetchSortedProducts();
    }
  }, [sortOrder,]);

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
