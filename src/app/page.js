
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FaHeart, FaShoppingCart } from "react-icons/fa";
import Spinner from "./components/common/Spinner";
import ErrorHandler from "./components/common/ErrorHandler";
import SearchBar from "./components/common/SearchBar";
import SortByCategory from "./components/common/SortByCategory";
import SortByPrice from "./components/common/SortByPrice";

/**
 * Displays a page of products with search and sort functionality.
 * @returns {JSX.Element} The ProductsPage component.
 */
export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  const router = useRouter();
  const searchParams = useSearchParams();

  const searchTerm = searchParams.get("search") || "";
  const category = searchParams.get("category") || "";
  const priceOrder = searchParams.get("price") || "";

  const fetchProducts = async (searchTerm = "", category = "", priceOrder = "", page = 1) => {
    setLoading(true);
    setErrorMessage("");

    try {
      const queryParams = new URLSearchParams({
        searchTerm,
        category,
        sortByPrice: priceOrder,
        page,
      });

      const response = await fetch(`/api/products?${queryParams}`);
      const data = await response.json();
      console.log(data);

      if (response.ok) {
        if (data.products.length === 0) {
          setErrorMessage("No products found");
          setProducts([]);
        } else {
          setProducts(data.products);
          setTotalPages(data.totalPages);
          setCurrentPage(page);
        }
      } else {
        setErrorMessage("Failed to fetch products from the API.");
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      setErrorMessage("An error occurred while fetching products.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts(searchTerm, category, priceOrder, currentPage);
  }, [searchTerm, category, priceOrder, currentPage]);

  const handleSearch = (term) => {
    setCurrentPage(1);
    router.push(`?search=${term}&category=${category}&price=${priceOrder}`);
  };

  const handleSort = (category) => {
    setCurrentPage(1);
    router.push(`?search=${searchTerm}&category=${category}&price=${priceOrder}`);
  };

  const handleSortByPrice = (order) => {
    setCurrentPage(1);
    router.push(`?search=${searchTerm}&category=${category}&price=${order}`);
  };

  const handleReset = () => {
    setCurrentPage(1); 
    router.push(`?`); 
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const handlePreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  return (
    <div className="cover mx-auto p-4">
      <div className="flex flex-col lg:flex-row lg:justify-center lg:items-center lg:space-x-4 mb-4 space-y-4 lg:space-y-0">
        <div className="w-full lg:w-auto">
          <SearchBar onSearch={handleSearch} />
        </div>

        <div className="w-full lg:w-auto">
          <SortByCategory onSort={handleSort} />
        </div>

        <div className="w-full lg:w-auto">
          <SortByPrice onSort={handleSortByPrice} />
        </div>

        <div className="w-full lg:w-auto">
          <button className="bg-gray-800 mb-4 text-white w-full lg:w-auto px-4 py-2 rounded" onClick={handleReset}>
            Reset Filters
          </button>
        </div>
      </div>

      {loading ? (
        <Spinner />
      ) : errorMessage ? (
        <div className="text-center text-red-500 font-bold">{errorMessage}</div>
      ) : (
        

                  <div className="flex justify-center space-x-4 mt-2">
                    <FaHeart className="text-gray-400 text-xl" />
                    <FaShoppingCart className="text-gray-400 text-xl" />
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="flex justify-between mt-4">
            <button 
              onClick={handlePreviousPage} 
              disabled={currentPage === 1}
              className="bg-gray-500 text-white px-4 py-2 rounded disabled:opacity-50"
            >
              Previous
            </button>
            <span>Page {currentPage} of {totalPages}</span>
            <button 
              onClick={handleNextPage} 
              disabled={currentPage === totalPages}
              className="bg-gray-500 text-white px-4 py-2 rounded"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
