"use client";

import Spinner from "../../components/common/Spinner";
import { useEffect, useState } from "react";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";
import { useRouter, useSearchParams } from "next/navigation";
import ErrorHandler from "../../components/common/ErrorHandler";
import Head from "next/head";

/**
 * ProductDetail component displays the details of a single product including images, rating, and reviews.
 * @param {Object} props - The props object for the ProductDetail component.
 * @param {Object} props.params - The dynamic route parameters containing the productId.
 * @returns {JSX.Element} The ProductDetail component.
 */
export default function ProductDetail({ params }) {
  const productId = params.productId;

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [sortOrder, setSortOrder] = useState("desc");
  const [sortType, setSortType] = useState("date");

  const router = useRouter();
  const searchParams = useSearchParams();

  const searchTerm = searchParams.get("search") || "";
  const category = searchParams.get("category") || "";
  const priceOrder = searchParams.get("price") || "";
  const currentPage = searchParams.get("page") || 1;

  /**
   * Fetches the product details based on the productId.
   */
  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `https://next-ecommerce-api.vercel.app/products/${productId}`
        );
        const data = await res.json();
        setProduct({
          title: data.title,
          description: data.description,
          category: data.category,
          price: data.price,
          rating: data.rating,
          images: data.images,
          stock: data.stock,
          availability: data.stock > 0 ? "In Stock" : "Out of Stock",
          reviews: data.reviews,
          tags: data.tags || [],
        });
        setSelectedImage(data.images[0]);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching product:", error);
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  /**
   * Renders stars based on the product's rating.
   * @param {number} rating - The product's rating out of 5.
   * @returns {JSX.Element[]} An array of star icons based on the rating.
   */
  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating - fullStars >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    const stars = [];

    for (let i = 0; i < fullStars; i++) {
      stars.push(<FaStar key={`full-${i}`} className="text-yellow-500" />);
    }

    if (hasHalfStar) {
      stars.push(<FaStarHalfAlt key="half" className="text-yellow-500" />);
    }

    for (let i = 0; i < emptyStars; i++) {
      stars.push(<FaRegStar key={`empty-${i}`} className="text-yellow-500" />);
    }

    return stars;
  };

  /**
   * Sorts the reviews based on the selected sort type and order.
   * @param {Object[]} reviews - An array of review objects.
   * @returns {Object[]} The sorted array of reviews.
   */
  const sortReviews = (reviews) => {
    return reviews.slice().sort((a, b) => {
      if (sortType === "date") {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
      } else if (sortType === "rating") {
        return sortOrder === "asc" ? a.rating - b.rating : b.rating - a.rating;
      }
    });
  };

  /**
   * Handles changes to the sort order (ascending or descending).
   * @param {string} order - The selected sort order ('asc' or 'desc').
   */
  const handleSortOrderChange = (order) => {
    setSortOrder(order);
  };

  /**
   * Handles changes to the sort type (by date or by rating).
   * @param {string} type - The selected sort type ('date' or 'rating').
   */
  const handleSortTypeChange = (type) => {
    setSortType(type);
  };

  /**
   * Renders customer reviews for the product.
   * @param {Object[]} reviews - An array of review objects containing reviewerName, date, rating, and comment.
   * @returns {JSX.Element} The reviews section of the component.
   */
  const renderReviews = (reviews) => {
    if (!reviews || reviews.length === 0) {
      return <p>No reviews available for this product.</p>;
    }

    const sortedReviews = sortReviews(reviews); // Sort reviews by selected order

    return (
      <div className="mt-6">
        <h2 className="text-2xl font-bold mb-4">Customer Reviews</h2>

        {/* Sort Options */}
        <div className="flex justify-between mb-4">
          {/* Sort by Type: Date or Rating */}
          <div>
            <label htmlFor="sort-type" className="mr-2">
              Sort by:
            </label>
            <select
              id="sort-type"
              value={sortType}
              onChange={(e) => handleSortTypeChange(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none"
            >
              <option value="date">Date</option>
              <option value="rating">Rating</option>
            </select>
          </div>

          {/* Sort Order: Ascending or Descending */}
          <div>
            <label htmlFor="sort-order" className="mr-2">
              Order:
            </label>
            <select
              id="sort-order"
              value={sortOrder}
              onChange={(e) => handleSortOrderChange(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none"
            >
              <option value="desc">
                {sortType === "rating" ? "Highest First" : "Newest First"}
              </option>
              <option value="asc">
                {sortType === "rating" ? "Lowest First" : "Oldest First"}
              </option>
            </select>
          </div>
        </div>

        {/* Render sorted reviews */}
        {sortedReviews.map((review, index) => (
          <div
            key={index}
            className="border-b border-gray-200 pb-4 mb-4 last:border-b-0"
          >
            <div className="flex items-center mb-2">
              <p className="font-bold">{review.reviewerName}</p>
              <span className="text-gray-500 ml-2">
                {new Date(review.date).toLocaleDateString()}
              </span>
            </div>
            <div className="flex items-center mb-2">
              {renderStars(review.rating)}
              <p className="ml-2 text-gray-600">{review.rating}/5</p>
            </div>
            <p>{review.comment}</p>
          </div>
        ))}
      </div>
    );
  };

  if (loading) return <Spinner />;
  if (!product) return <ErrorHandler />;

  return (
    <div className="container mx-auto p-4">
      <Head>
        <title>
          {product ? `${product.title} | Your Store` : "Loading..."}
        </title>
        <meta
          name="description"
          content={product ? product.description : "Loading..."}
        />
        <meta
          property="og:title"
          content={product ? product.title : "Loading..."}
        />
        <meta
          property="og:description"
          content={product ? product.description : "Loading..."}
        />
        <meta property="og:image" content={product ? product.images[0] : ""} />
      </Head>

      <div className="flex flex-col lg:flex-row bg-white p-6 shadow-md rounded-lg">
        <div className="relative lg:w-1/3 w-full mb-4 lg:mb-0 lg:mr-4">
          <button
            onClick={() => {
              const params = new URLSearchParams({
                search: searchTerm,
                category: category,
                price: priceOrder,
                page: currentPage,
              });

              router.push(`/?${params.toString()}`);
            }}
            className="absolute -top-6 left-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 z-10"
          >
            Back to Products
          </button>

          <div className="mb-4">
            <img
              src={selectedImage}
              alt={product.title}
              className="h-auto w-full object-cover rounded-md"
            />
          </div>

          <div className="flex space-x-2">
            {product.images.map((image, index) => (
              <img
                key={index}
                src={image}
                alt={`${product.title} thumbnail ${index + 1}`}
                className={`h-20 w-20 object-cover cursor-pointer rounded-md border-2 ${
                  selectedImage === image
                    ? "border-blue-500"
                    : "border-transparent"
                }`}
                onClick={() => setSelectedImage(image)}
              />
            ))}
          </div>
        </div>

        <div className="lg:w-2/3 w-full">
          <h1 className="text-3xl font-bold mb-2">{product.title}</h1>
          <p className="text-gray-700 mb-4">{product.description}</p>
          <p className="text-gray-500 mb-2">Category: {product.category}</p>

          <div className="flex items-center mb-4">
            <p className="text-gray-500 mr-2">Rating:</p>
            <div className="flex">{renderStars(product.rating)}</div>
            <p className="ml-2 text-gray-600">{product.rating}/5</p>
          </div>
          <p className="text-gray-900 font-bold text-2xl">${product.price}</p>

          <p className="text-green-600 mt-2">{product.availability}</p>
          <p className="text-gray-500">Stock: {product.stock}</p>

          {product.tags && product.tags.length > 0 && (
            <div className="mt-4">
              <h3 className="font-bold text-lg mb-2">Tags:</h3>
              <div className="flex flex-wrap">
                {product.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="bg-gray-200 text-gray-700 px-3 py-1 rounded-full mr-2 mb-2 text-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {renderReviews(product.reviews)}
        </div>
      </div>
    </div>
  );
}
