import { useState, useEffect } from "react";

/**
 * SearchBar component allows users to search for products by entering a search term.
 *
 * @component
 * @param {Object} props - The component's props.
 * @param {Function} props.onSearch - Callback function triggered when a search is initiated.
 * It receives the search term as an argument.
 *
 * @example
 * <SearchBar onSearch={(term) => console.log(term)} />
 */
export default function SearchBar({ onSearch }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);
  const [noResults, setNoResults] = useState(false);

  /**
   * Effect for debouncing the search term input.
   * It updates the debouncedSearchTerm state after a delay of 300ms.
   * Cleans up by clearing the timeout on unmount or when searchTerm changes.
   */

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);

    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm]);

  /**
   * Effect for fetching product suggestions based on the debounced search term.
   * It sets suggestions or updates the noResults state based on the fetched data.
   * Catches and logs any errors encountered during the fetch.
   */
  useEffect(() => {
    if (debouncedSearchTerm.trim()) {
      const fetchSuggestions = async () => {
        try {
          const response = await fetch(
            `/api/products?searchTerm=${debouncedSearchTerm}`
          );
          const data = await response.json();

          if (data.products && data.products.length > 0) {
            setSuggestions(data.products);
            setNoResults(false);
          } else {
            setSuggestions([]);
            setNoResults(true);
          }
        } catch (error) {
          console.error("Error fetching search suggestions:", error);
        }
      };

      fetchSuggestions();
    } else {
      setSuggestions([]);
      setNoResults(false);
    }
  }, [debouncedSearchTerm]);

  /**
   * Handles the search action when the search button is clicked.
   * It triggers the onSearch callback with the debounced search term.
   */

  const handleSearch = () => {
    if (debouncedSearchTerm.trim()) {
      onSearch(debouncedSearchTerm);
    }
  };

  return (
    <div className="relative flex justify-center mb-6">
      <div className="relative w-full max-w-md">
        <input
          type="text"
          placeholder="Search products"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 border rounded-l-md"
        />
        <button
          className="absolute right-0 top-0 h-full bg-blue-500 text-white px-4 rounded-r-md hover:bg-blue-600"
          onClick={handleSearch}
        >
          Search
        </button>

        {suggestions.length > 0 ? (
          <ul className="absolute top-full left-0 w-full bg-white border border-gray-300 rounded-md mt-1 max-h-60 overflow-y-auto z-10">
            {suggestions.map((product) => (
              <li
                key={product.id}
                onClick={() => {
                  setSearchTerm(product.title);
                  setSuggestions([]);
                  onSearch(product.title);
                }}
                className="px-4 py-2 hover:bg-gray-200 cursor-pointer"
              >
                {product.title}
              </li>
            ))}
          </ul>
        ) : (
          noResults && (
            <div className="absolute top-full left-0 w-full bg-white border border-gray-300 rounded-md mt-1 z-10 p-4 text-gray-600">
              No product(s) found
            </div>
          )
        )}
      </div>
    </div>
  );
}
