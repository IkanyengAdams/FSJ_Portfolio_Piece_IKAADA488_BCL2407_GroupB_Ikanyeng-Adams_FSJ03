import { db } from "../../../../../../lib/firebase";
import { collection, addDoc, Timestamp } from "firebase/firestore";

/**
 * Handles the POST request to add a review for a specific product.
 *
 * @param {Request} req - The HTTP request object.
 * @param {Object} params - The parameters from the request context.
 * @param {string} params.productId - The ID of the product to which the review is being added.
 * @returns {Response} A response object indicating the result of the operation.
 */

export async function POST(req, { params }) {
  const { productId } = params;
  const { rating, comment, reviewerEmail, reviewerName } = await req.json();

  // Validate required fields
  if (!rating || !comment || !reviewerEmail || !reviewerName) {
    return new Response("Missing required fields", { status: 400 });
  }

  try {
    const reviewsRef = collection(db, "products", productId, "reviews");
    // Add the review document to the collection
    await addDoc(reviewsRef, {
      rating,
      comment,
      reviewerEmail,
      reviewerName,
      date: Timestamp.now(),
    });

    return new Response("Review added successfully", { status: 201 });
  } catch (error) {
    console.error("Error adding review: ", error);
    return new Response("Error adding review", { status: 500 });
  }
}
