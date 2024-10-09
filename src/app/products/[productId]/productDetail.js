"use client";

import Spinner from "../../components/common/Spinner";
import { useEffect, useState } from "react";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";
import ErrorHandler from "../../components/common/ErrorHandler";
import Head from "next/head";
import { useRouter } from 'next/navigation';
import { db } from "../../../../lib/firebase"; 
import { collection, getDocs, doc, updateDoc, deleteDoc } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";

export default function ProductDetail({ params }) {
  const { productId } = params;
  const router = useRouter();
  const auth = getAuth();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [reviewerEmail, setReviewerEmail] = useState('');
  const [reviewerName, setReviewerName] = useState('');
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
          throw new Error('Failed to fetch product data');
        }

        const data = await response.json();
        if (data.product) {
          setProduct(data.product);
          setSelectedImage(data.product.images[0] || null);

          const reviewsSnapshot = await getDocs(collection(db, "products", productId, "reviews"));
          const reviews = reviewsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          setProduct(prevProduct => ({ ...prevProduct, reviews }));
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
          {reviews.map((review) => (
            <div key={review.id} className="border-b mb-2 pb-2">
              <div className="flex items-center mb-1">
                {Array.from({ length: review.rating }, (_, i) => (
                  <FaStar key={i} className="text-yellow-500" />
                ))}
                {review.rating % 1 !== 0 && <FaStarHalfAlt className="text-yellow-500" />}
                {Array.from({ length: 5 - Math.ceil(review.rating) }, (_, i) => (
                  <FaRegStar key={i} className="text-yellow-500" />
                ))}
                <span className="ml-2 text-gray-600">{review.reviewerName}</span>
              </div>
              <p className="text-gray-700">{review.comment}</p>
              <p className="text-gray-500 text-sm">
                {review.date && new Date(review.date.seconds * 1000).toLocaleDateString()}
              </p>
              <div className="flex space-x-2 mt-2">
                <button onClick={() => handleEditReview(review)} className="px-4 py-2 border border-blue-500 text-blue-500 bg-white rounded-md hover:bg-blue-500 hover:text-white transition">
                  Edit
                </button>
                <button onClick={() => handleDeleteReview(review.id)} className="px-4 py-2 border border-red-500 text-red-500 bg-white rounded-md hover:bg-red-500 hover:text-white transition">
                  Delete
                </button>
              </div>
              {editingReviewId === review.id && (
                <form onSubmit={(e) => handleUpdateReview(e, review.id)} className="mt-4">
                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="border rounded-md p-2 w-full"
                    rows="4"
                    required
                  />
                  <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition mt-2">Update Review</button>
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

  const handleUpdateReview = async (e, reviewId) => {
    e.preventDefault();
    try {
      await updateDoc(doc(db, "products", productId, "reviews", reviewId), { comment });
      const updatedReviews = product.reviews.map(review =>
        review.id === reviewId ? { ...review, comment } : review
      );
      setProduct(prevProduct => ({ ...prevProduct, reviews: updatedReviews }));
      setReviewSuccess("Review updated successfully!");
      setEditingReviewId(null);
      setComment('');
    } catch (error) {
      setReviewError("Failed to update review.");
      console.error(error);
    }
  };

  const handleDeleteReview = async (reviewId) => {
    // Instead of a confirmation dialog, we will handle it directly
    try {
      await deleteDoc(doc(db, "products", productId, "reviews", reviewId));
      const updatedReviews = product.reviews.filter(review => review.id !== reviewId);
      setProduct(prevProduct => ({ ...prevProduct, reviews: updatedReviews }));
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
        date: { seconds: Math.floor(Date.now() / 1000) },
      };

      setProduct((prevProduct) => ({
        ...prevProduct,
        reviews: [...prevProduct.reviews, newReview],
      }));

      setReviewSuccess("Review submitted successfully!");
      setRating(0);
      setComment('');
      setReviewerEmail('');
      setReviewerName('');
    } catch (error) {
      setReviewError(error.message);
    }
  };

  if (loading) return <Spinner />;
  if (error) return <ErrorHandler message={error} />;

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
              <div className="flex space-x-2">
                {product.images.map((image) => (
                  <img
                    key={image}
                    src={image}
                    alt={product.title}
                    onClick={() => setSelectedImage(image)}
                    className={`cursor-pointer w-16 h-16 object-cover ${image === selectedImage ? "border-2 border-blue-500" : "border"}`}
                  />
                ))}
              </div>
            </>
          )}
        </div>

        <div className="lg:w-2/3 w-full pl-4">
          <h1 className="text-2xl font-bold">{product.title}</h1>
          <p className="text-lg text-gray-600">{`$${product.price.toFixed(2)}`}</p>
          <p className="mt-4">{product.description}</p>

          <div className="mt-4">
            <h2 className="font-bold">Add a Review:</h2>
            <form onSubmit={submitReview} className="mt-2">
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="border rounded-md p-2 w-full"
                rows="4"
                required
              />
              <div className="flex items-center mt-2">
                <label className="mr-2">Rating:</label>
                {[1, 2, 3, 4, 5].map((rate) => (
                  <label key={rate} className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      value={rate}
                      checked={rating === rate}
                      onChange={(e) => setRating(Number(e.target.value))}
                      className="hidden"
                    />
                    <FaStar className={`text-yellow-500 ${rating >= rate ? "text-yellow-500" : "text-gray-300"}`} />
                  </label>
                ))}
              </div>
              {reviewError && <p className="text-red-500">{reviewError}</p>}
              {reviewSuccess && <p className="text-green-500">{reviewSuccess}</p>}
              <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition mt-2">Submit Review</button>
            </form>
          </div>

          {product.reviews && renderReviews(product.reviews)}
        </div>
      </div>
    </div>
  );
}
