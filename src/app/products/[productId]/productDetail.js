"use client";

import Spinner from "../../components/common/Spinner";
import { useEffect, useState } from "react";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";
import ErrorHandler from "../../components/common/ErrorHandler";
import Head from "next/head";
import { useRouter } from "next/navigation";
import { db } from "../../../../lib/firebase";
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";

/**
 * ProductDetail component to display product information, reviews, and handle review submissions.
 *
 * @param {Object} props - Component props.
 * @param {Object} props.params - Route parameters.
 * @param {string} props.params.productId - ID of the product to fetch and display.
 * @returns {JSX.Element} The rendered component.
 */
export default function ProductDetail({ params }) {
  const { productId } = params;
  const router = useRouter();
  const auth = getAuth();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [reviewerEmail, setReviewerEmail] = useState("");
  const [reviewerName, setReviewerName] = useState("");
  const [reviewError, setReviewError] = useState(null);
  const [reviewSuccess, setReviewSuccess] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [editingReviewId, setEditingReviewId] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsLoggedIn(!!user);
    });

    return () => unsubscribe();
  }, [auth]);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!productId) return;
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`/api/products/${productId}`);

        if (!response.ok) {
          throw new Error("Failed to fetch product data");
        }

        const data = await response.json();
        if (data.product) {
          setProduct(data.product);
          setSelectedImage(data.product.images[0] || null);

          const reviewsSnapshot = await getDocs(
            collection(db, "products", productId, "reviews")
          );
          const reviews = reviewsSnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setProduct((prevProduct) => ({ ...prevProduct, reviews }));
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

  /**
   * Renders the reviews for the product.
   *
   * @param {Array} reviews - The list of reviews for the product.
   * @returns {JSX.Element} The rendered reviews or a message indicating no reviews.
   */

  const renderReviews = (reviews) => {
    if (!reviews || reviews.length === 0) {
      return <p className="text-gray-500">No reviews yet.</p>;
    }

    return (
      <div className="mt-4">
        <h3 className="font-bold mb-2">Reviews:</h3>
        <div>
          {reviews.map((review) => (
            <div key={review.id} className="border-b mb-2 pb-2">
              <div className="flex items-center mb-1">
                {Array.from({ length: review.rating }, (_, i) => (
                  <FaStar key={i} className="text-yellow-500" />
                ))}
                {review.rating % 1 !== 0 && (
                  <FaStarHalfAlt className="text-yellow-500" />
                )}
                {Array.from(
                  { length: 5 - Math.ceil(review.rating) },
                  (_, i) => (
                    <FaRegStar key={i} className="text-yellow-500" />
                  )
                )}
                <span className="ml-2 text-gray-600">{review.reviewerName}</span>
              </div>
              <p className="text-gray-700">{review.comment}</p>
              <p className="text-gray-500 text-sm">{review.reviewerEmail}</p>
              <p className="text-gray-500 text-sm">
                {review.date &&
                  new Date(review.date.seconds * 1000).toLocaleDateString()}
              </p>
              <div className="flex space-x-2 mt-2">
                <button
                  onClick={() => handleEditReview(review)}
                  className="px-4 py-2 border border-blue-500 text-blue-500 bg-white rounded-md hover:bg-blue-500 hover:text-white transition"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteReview(review.id)}
                  className="px-4 py-2 border border-red-500 text-red-500 bg-white rounded-md hover:bg-red-500 hover:text-white transition"
                >
                  Delete
                </button>
              </div>
              {editingReviewId === review.id && (
                <form
                  onSubmit={(e) => handleUpdateReview(e, review.id)}
                  className="mt-4"
                >
                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="border rounded-md p-2 w-full"
                    rows="4"
                    required
                  />
                  <button
                    type="submit"
                    className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition mt-2"
                  >
                    Update Review
                  </button>
                </form>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const handleEditReview = (review) => {
    setEditingReviewId(review.id);
    setComment(review.comment);
  };

  /**
   * Handles updating a review.
   *
   * @param {Object} e - The event object.
   * @param {string} reviewId - The ID of the review to update.
   */

  const handleUpdateReview = async (e, reviewId) => {
    e.preventDefault();
    try {
      await updateDoc(doc(db, "products", productId, "reviews", reviewId), {
        comment,
      });
      const updatedReviews = product.reviews.map((review) =>
        review.id === reviewId ? { ...review, comment } : review
      );
      setProduct((prevProduct) => ({
        ...prevProduct,
        reviews: updatedReviews,
      }));
      setReviewSuccess("Review updated successfully!");
      setEditingReviewId(null);
      setComment("");
    } catch (error) {
      setReviewError("Failed to update review.");
      console.error(error);
    }
  };

  /**
   * Handles deleting a review.
   *
   * @param {string} reviewId - The ID of the review to delete.
   */

  const handleDeleteReview = async (reviewId) => {
    try {
      await deleteDoc(doc(db, "products", productId, "reviews", reviewId));
      const updatedReviews = product.reviews.filter(
        (review) => review.id !== reviewId
      );
      setProduct((prevProduct) => ({
        ...prevProduct,
        reviews: updatedReviews,
      }));
      setReviewSuccess("Review deleted successfully!");
    } catch (error) {
      setReviewError("Failed to delete review.");
      console.error(error);
    }
  };

  const submitReview = async (e) => {
    e.preventDefault();
    if (!isLoggedIn) {
      setReviewError("Please login first to submit a review.");
      return;
    }

    setReviewError(null);
    setReviewSuccess(null);

    try {
      const response = await fetch(`/api/products/${productId}/reviews`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ rating, comment, reviewerEmail, reviewerName }),
      });

      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(errorMessage);
      }

      const newReview = {
        rating,
        comment,
        reviewerName,
        reviewerEmail,
        date: { seconds: Math.floor(Date.now() / 1000) },
      };

      setProduct((prevProduct) => ({
        ...prevProduct,
        reviews: [...prevProduct.reviews, newReview],
      }));

      setReviewSuccess("Review submitted successfully!");
      setRating(0);
      setComment("");
      setReviewerEmail("");
      setReviewerName("");
    } catch (error) {
      setReviewError(error.message);
    }
  };

  if (loading) return <Spinner />;
  if (error) return <ErrorHandler message={error} />;

  return (
    <div className="container mx-auto p-4">
      <Head>
        <title>{product ? product.title : "Product"}</title>
        <meta name="description" content={product?.description || "Product"} />
      </Head>
      <button
        onClick={() => router.back()}
        className="bg-gray-200 text-gray-800 py-2 px-4 rounded-md mb-4 hover:bg-gray-300 transition"
      >
        Back
      </button>
      <div className="flex flex-col md:flex-row">
        <div className="md:w-1/2">
          {selectedImage && (
            <img
              src={selectedImage}
              alt={product.title}
              className="w-full h-auto object-cover"
            />
          )}
        </div>
        <div className="md:w-1/2 md:pl-8">
          <h1 className="text-3xl font-bold mb-4">{product.title}</h1>
          <p className="text-gray-700 mb-4">{product.description}</p>
          <p className="text-lg font-semibold mb-4">${product.price}</p>
          <div className="flex space-x-2 mb-4">
            {product.tags.map((tag) => (
              <span
                key={tag}
                className="px-2 py-1 bg-gray-200 rounded-full text-sm text-gray-700"
              >
                {tag}
              </span>
            ))}
          </div>
          <form onSubmit={submitReview} className="mt-4">
            <h3 className="font-bold mb-2">Leave a review:</h3>
            <input
              type="email"
              value={reviewerEmail}
              onChange={(e) => setReviewerEmail(e.target.value)}
              placeholder="Your email"
              className="border p-2 rounded-md w-full mb-2"
              required
            />
            <input
              type="text"
              value={reviewerName}
              onChange={(e) => setReviewerName(e.target.value)}
              placeholder="Your name"
              className="border p-2 rounded-md w-full mb-2"
              required
            />
            <div className="flex items-center mb-2">
              <span className="mr-2">Rating:</span>
              <input
                type="number"
                value={rating}
                onChange={(e) => setRating(Number(e.target.value))}
                min="0"
                max="5"
                step="0.5"
                className="border p-2 rounded-md"
                required
              />
            </div>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Write your review..."
              className="border rounded-md p-2 w-full"
              rows="4"
              required
            />
            {reviewError && (
              <p className="text-red-500 mt-2">{reviewError}</p>
            )}
            {reviewSuccess && (
              <p className="text-green-500 mt-2">{reviewSuccess}</p>
            )}
            <button
              type="submit"
              className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition mt-2"
            >
              Submit Review
            </button>
          </form>
          {renderReviews(product.reviews)}
        </div>
      </div>
    </div>
  );
}
