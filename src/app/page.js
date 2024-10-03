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
 * Displays a page of products with pagination, search, and sort functionality.
 * @returns {JSX.Element} The ProductsPage component.
 */
export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [hasMoreProducts, setHasMoreProducts] = useState(true);
  const productsPerPage = 20;

  const router = useRouter();
  const searchParams = useSearchParams();

  const searchTerm = searchParams.get("search") || "";
  const category = searchParams.get("category") || "";
  const priceOrder = searchParams.get("price") || "";
  const currentPage = parseInt(searchParams.get("page")) || 1;

  /**
   * Fetches products from the API based on the page number, search term, category, and price sort order.
   * @param {number} page - The current page number.
   * @param {string} [searchTerm=""] - Optional search term for product filtering.
   * @param {string} [category=""] - Optional category for sorting products.
   * @param {string} [priceOrder=""] - Optional price sorting order ('asc' or 'desc').
   */
  const fetchProducts = async (
    page,
    searchTerm = "",
    category = "",
    priceOrder = ""
  ) => {
    setLoading(true);
    setErrorMessage("");
    const skip = (page - 1) * productsPerPage;
    let apiUrl = `https://next-ecommerce-api.vercel.app/products?limit=${productsPerPage}&skip=${skip}`;

    if (searchTerm) apiUrl += `&search=${searchTerm}`;
    if (category) apiUrl += `&category=${category}`;
    if (priceOrder) apiUrl += `&sortBy=price&order=${priceOrder}`;

    try {
      const res = await fetch(apiUrl);
      const data = await res.json();

      if (!Array.isArray(data)) {
        setErrorMessage("Invalid data received.");
        setFilteredProducts([]);
        setHasMoreProducts(false);
      } else if (data.length === 0) {
        setErrorMessage("Product does not exist");
        setFilteredProducts([]);
        setHasMoreProducts(false);
      } else {
        setProducts(data);
        setFilteredProducts(data);
        setHasMoreProducts(data.length === productsPerPage);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      setErrorMessage("An error occurred while fetching products.");
      setFilteredProducts([]);
      setHasMoreProducts(false);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchProducts(currentPage, searchTerm, category, priceOrder);
  }, [searchTerm, category, priceOrder, currentPage]);

  /**
   * Handles the search operation by updating the URL with the search term.
   * @param {string} term - The search term to filter products.
   */
  const handleSearch = (term) => {
    router.push(
      `?search=${term}&category=${category}&price=${priceOrder}&page=1`
    );
  };

  /**
   * Handles sorting by category by updating the URL with the selected category.
   * @param {string} category - The category to sort products by.
   */
  const handleSort = (category) => {
    router.push(
      `?search=${searchTerm}&category=${category}&price=${priceOrder}&page=1`
    );
  };

  /**
   * Handles sorting products by price by updating the URL with the selected order.
   * @param {string} order - The order to sort by ('asc' or 'desc').
   */
  const handleSortByPrice = (order) => {
    router.push(
      `?search=${searchTerm}&category=${category}&price=${order}&page=1`
    );
  };

  /**
   * Resets the filters, search, and sorting by clearing the query parameters.
   */
  const handleReset = () => {
    router.push(`?page=1`);
  };

  /**
   * Navigates to the next page of products by updating the URL with the next page number.
   */
  const handleNextPage = () => {
    router.push(
      `?search=${searchTerm}&category=${category}&price=${priceOrder}&page=${
        currentPage + 1
      }`
    );
  };

  /**
   * Navigates to the previous page of products by updating the URL with the previous page number.
   */
  const handlePrevPage = () => {
    if (currentPage > 1) {
      router.push(
        `?search=${searchTerm}&category=${category}&price=${priceOrder}&page=${
          currentPage - 1
        }`
      );
    }
  };

  return (
    <div className="cover mx-auto p-4">
      <div className="flex flex-col lg:flex-row lg:justify-center lg:items-center lg:space-x-4 mb-4 space-y-4 lg:space-y-0">
        {/* SearchBar Component */}
        <div className="w-full lg:w-auto">
          <SearchBar onSearch={handleSearch} />
        </div>

        {/* SortByCategory Component */}
        <div className="w-full lg:w-auto">
          <SortByCategory onSort={handleSort} />
        </div>

        {/* SortByPrice Component */}
        <div className="w-full lg:w-auto">
          <SortByPrice onSort={handleSortByPrice} />
        </div>

        {/* Reset Button */}
        <div className="w-full lg:w-auto">
          <button
            className="bg-gray-800 mb-4 text-white w-full lg:w-auto px-4 py-2 rounded"
            onClick={handleReset}
          >
            Reset Filters
          </button>
        </div>
      </div>

      {loading ? (
        <Spinner />
      ) : errorMessage ? (
        <div className="text-center text-red-500 font-bold">{errorMessage}</div>
      ) : Array.isArray(filteredProducts) && filteredProducts.length === 0 ? (
        <ErrorHandler />
      ) : (
        Array.isArray(filteredProducts) && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="bg-white p-4 shadow-md rounded-lg transition-transform transform hover:scale-105 hover:shadow-lg"
              >
                <ImageCarousel images={product.images} />
                <h2 className="text-xl font-semibold mb-2 text-black">
                  {product.title}
                </h2>
                <p className="text-gray-800">{product.category}</p>
                <p className="text-gray-900 font-bold">${product.price}</p>

                <div className="flex justify-center mt-4">
                  <Link
                    href={{
                      pathname: `/products/${product.id}`,
                      query: {
                        search: searchTerm,
                        category: category,
                        price: priceOrder,
                        page: currentPage,
                      },
                    }}
                  >
                    <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                      View Product
                    </button>
                  </Link>
                </div>

                <div className="flex justify-center space-x-4 mt-2">
                  <FaHeart className="text-gray-400 text-xl" />
                  <FaShoppingCart className="text-gray-400 text-xl" />
                </div>
              </div>
            ))}
          </div>
        )
      )}

      <div className="flex justify-between mt-4">
        {currentPage > 1 && (
          <button
            className="bg-gray-800 text-white px-4 py-2 rounded"
            onClick={handlePrevPage}
          >
            Previous
          </button>
        )}

        {hasMoreProducts && (
          <button
            className="bg-gray-800 text-white px-4 py-2 rounded"
            onClick={handleNextPage}
          >
            Next
          </button>
        )}
      </div>
    </div>
  );
}

/**
 * ImageCarousel component to display images in a carousel.
 * @param {Object} props - The props for the ImageCarousel component.
 * @param {string[]} props.images - Array of image URLs for the product.
 * @returns {JSX.Element} The ImageCarousel component.
 */
function ImageCarousel({ images }) {
  const [currentImage, setCurrentImage] = useState(0);

  /**
   * Moves to the next image in the carousel.
   */
  const handleNextImage = () => {
    setCurrentImage((prev) => (prev + 1) % images.length);
  };

  /**
   * Moves to the previous image in the carousel.
   */
  const handlePrevImage = () => {
    setCurrentImage((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="relative">
      <img
        src={images[currentImage]}
        alt={`Product Image ${currentImage + 1}`}
        className="h-80 w-full object-contain mb-4"
      />
      {images.length > 1 && (
        <>
          <button
            onClick={handlePrevImage}
            className="absolute top-1/2 left-2 transform -translate-y-1/2 bg-gray-800 text-white px-2 py-1 rounded-full"
          >
            &lt;
          </button>
          <button
            onClick={handleNextImage}
            className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-gray-800 text-white px-2 py-1 rounded-full"
          >
            &gt;
          </button>
        </>
      )}
    </div>
  );
}
