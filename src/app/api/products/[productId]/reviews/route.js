

import { db } from "../../../../../../lib/firebase"; 
import { collection, addDoc, Timestamp } from "firebase/firestore";

export async function POST(req, { params }) {
  const { productId } = params;
  const { rating, comment, reviewerEmail, reviewerName } = await req.json();

  if (!rating || !comment || !reviewerEmail || !reviewerName) {
    return new Response("Missing required fields", { status: 400 });
  }

  try {
  
    const reviewsRef = collection(db, "products", productId, "reviews");


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
