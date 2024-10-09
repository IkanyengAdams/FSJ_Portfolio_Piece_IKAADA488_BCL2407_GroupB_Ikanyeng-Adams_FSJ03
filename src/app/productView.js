"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FaHeart, FaShoppingCart, FaArrowLeft, FaArrowRight } from "react-icons/fa";
import Spinner from "./components/common/Spinner";
import ErrorHandler from "./components/common/ErrorHandler";
import SearchBar from "./components/common/SearchBar";
import SortByCategory from "./components/common/SortByCategory";
import SortByPrice from "./components/common/SortByPrice";

export default function ProductView() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [totalPages, setTotalPages] = useState(0);
  const [carouselIndex, setCarouselIndex] = useState({});

  const router = useRouter();
  const searchParams = useSearchParams();

  const searchTerm = searchParams.get("search") || "";
  const category = searchParams.get("category") || "";
  const priceOrder = searchParams.get("price") || "";
  const currentPage = Number(searchParams.get("page")) || 1;

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
    router.push(`?search=${term}&category=${category}&price=${priceOrder}&page=1`);
  };

  const handleSort = (newCategory) => {
    router.push(`?search=${searchTerm}&category=${newCategory}&price=${priceOrder}&page=1`);
  };

  const handleSortByPrice = (order) => {
    router.push(`?search=${searchTerm}&category=${category}&price=${order}&page=1`);
  };

  const handleReset = () => {
    router.push(`?search=&category=&price=&page=1`);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      router.push(`?search=${searchTerm}&category=${category}&price=${priceOrder}&page=${currentPage + 1}`);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      router.push(`?search=${searchTerm}&category=${category}&price=${priceOrder}&page=${currentPage - 1}`);
    }
  };

  // Carousel logic
  const handleNextImage = (productId) => {
    setCarouselIndex((prev) => ({
      ...prev,
      [productId]: (prev[productId] + 1) % products.find(p => p.id === productId).images.length,
    }));
  };

  const handlePreviousImage = (productId) => {
    setCarouselIndex((prev) => ({
      ...prev,
      [productId]: (prev[productId] - 1 + products.find(p => p.id === productId).images.length) % products.find(p => p.id === productId).images.length,
    }));
  };

  return (
    <div className="cover mx-auto p-4">
      <div className="flex flex-col lg:flex-row lg:justify-center lg:items-center lg:space-x-4 mb-4 space-y-4 lg:space-y-0">
        <SearchBar onSearch={handleSearch} />
        <SortByCategory onSort={handleSort} />
        <SortByPrice onSort={handleSortByPrice} />
        <button className="bg-gray-800 mb-4 text-white w-full lg:w-auto px-4 py-2 rounded" onClick={handleReset}>
          Reset Filters
        </button>
      </div>

      {loading ? (
        <Spinner />
      ) : errorMessage ? (
        <div className="text-center text-red-500 font-bold">{errorMessage}</div>
      ) : (
        <div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {products.length === 0 ? (
              <ErrorHandler />
            ) : (
              products.map((product) => (
                <div key={product.id} className="bg-white p-4 shadow-md rounded-lg transition-transform transform hover:scale-105 hover:shadow-lg">
                  {product.images && product.images.length > 0 ? (
                    <div className="relative">
                      <img
                        src={product.images[carouselIndex[product.id] || 0]}
                        alt={product.title}
                        className="w-full h-48 object-contain mb-4"
                      />
                      {product.images.length > 1 && (
                        <div className="absolute inset-0 flex justify-between items-center">
                          <button className="bg-gray-800 text-white p-2 rounded-full" onClick={() => handlePreviousImage(product.id)}>
                            <FaArrowLeft />
                          </button>
                          <button className="bg-gray-800 text-white p-2 rounded-full" onClick={() => handleNextImage(product.id)}>
                            <FaArrowRight />
                          </button>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="w-full h-48 bg-gray-300 mb-4 rounded flex items-center justify-center">
                      <span>No Image Available</span>
                    </div>
                  )}
                  <h2 className="text-xl font-semibold mb-2 text-black">{product.title}</h2>
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
