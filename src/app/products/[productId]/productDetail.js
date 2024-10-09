"use client";

import Spinner from "../../components/common/Spinner";
import { useEffect, useState } from "react";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";
import ErrorHandler from "../../components/common/ErrorHandler";
import Head from "next/head";
import { useRouter } from 'next/navigation';

/**
 * ProductDetail component displays the details of a single product including images, rating, and reviews.
 * @param {Object} params - The route parameters provided by Next.js (contains productId).
 * @returns {JSX.Element} The ProductDetail component.
 */
export default function ProductDetail({ params }) {
  const { productId } = params; // Use params directly to get the productId
  const router = useRouter(); // Initialize the router

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); 
  const [selectedImage, setSelectedImage] = useState(null);

  /**
   * Fetches the product details based on the productId from local API.
   */
  useEffect(() => {
    const fetchProduct = async () => {
      if (!productId) return;
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`/api/products/${productId}`);

        if (!response.ok) {
          throw new Error('Failed to fetch product data');
        }

        const data = await response.json();
        if (data.product) {
          setProduct(data.product);
          setSelectedImage(data.product.images[0] || null);
        } else {
          setError("Product not found");
        }
      } catch (error) {
        console.error("Error fetching product:", error);
        setError(error.message || "Failed to fetch product data");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  
  const renderReviews = (reviews) => {
    if (!reviews || reviews.length === 0) {
      return <p className="text-gray-500">No reviews yet.</p>;
    }
    
    return (
      <div className="mt-4">
        <h3 className="font-bold mb-2">Reviews:</h3>
        <div>
          {reviews.map((review, index) => (
            <div key={index} className="border-b mb-2 pb-2">
              <div className="flex items-center mb-1">
                {Array.from({ length: review.rating }, (_, i) => (
                  <FaStar key={i} className="text-yellow-500" />
                ))}
                {review.rating % 1 !== 0 && <FaStarHalfAlt className="text-yellow-500" />}
                {Array.from({ length: 5 - Math.ceil(review.rating) }, (_, i) => (
                  <FaRegStar key={i} className="text-yellow-500" />
                ))}
                <span className="ml-2 text-gray-600">{review.username}</span>
              </div>
              <p className="text-gray-700">{review.comment}</p>
            </div>
          ))}
        </div>
      </div>
    );
  };

  if (loading) return <Spinner />;
  if (error) return <ErrorHandler message={error} />; // Display error message

  return (
    <div className="container mx-auto p-4">
      <Head>
        <title>{product.title} | Your Store</title>
        <meta name="description" content={product.description} />
        <meta property="og:title" content={product.title} />
        <meta property="og:description" content={product.description} />
        <meta property="og:image" content={product.images[0] || ""} />
      </Head>

      <button onClick={() => router.back()} className="mb-4 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-md">
        Back
      </button>

      <div className="flex flex-col lg:flex-row bg-white p-6 shadow-md rounded-lg">
        <div className="relative lg:w-1/3 w-full mb-4 lg:mb-0">
          {product.images && (
            <>
              <img src={selectedImage} alt={product.title} className="w-full h-auto object-contain mb-4" />
              <div className="flex justify-center mt-2 space-x-2">
                {product.images.map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`Thumbnail ${index + 1}`}
                    className={`w-16 h-16 object-cover cursor-pointer ${image === selectedImage ? "border-2 border-indigo-500" : "border border-gray-300"}`}
                    onClick={() => setSelectedImage(image)}
                  />
                ))}
              </div>
            </>
          )}
        </div>
        <div className="lg:w-2/3 w-full lg:pl-10">
          <h1 className="text-3xl font-bold mb-4">{product.title}</h1>
          <p className="text-lg mb-2">{product.description}</p>
          <p className="text-xl font-semibold mb-4">${product.price}</p>
          <p className="mb-4">
            {product.stock > 0 ? (
              <span className="text-green-500">In Stock</span>
            ) : (
              <span className="text-red-500">Out of Stock</span>
            )}
          </p>

          {product.tags && product.tags.length > 0 && (
            <div className="mb-4">
              <h3 className="font-bold mb-2">Tags:</h3>
              <div className="flex flex-wrap space-x-2">
                {product.tags.map((tag, index) => (
                  <span key={index} className="px-2 py-1 bg-gray-200 text-gray-700 rounded-md">{tag}</span>
                ))}
              </div>
            </div>
          )}

          {renderReviews(product.reviews)}

          {/* Optional: Render dimensions if available */}
          {product.dimensions && Object.keys(product.dimensions).length > 0 && (
            <div className="mt-4">
              <h3 className="font-bold mb-2">Dimensions:</h3>
              <p>{JSON.stringify(product.dimensions)}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
