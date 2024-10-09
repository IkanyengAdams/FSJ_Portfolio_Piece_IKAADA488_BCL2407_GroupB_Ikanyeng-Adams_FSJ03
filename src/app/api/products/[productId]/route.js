import { doc, getDoc } from "firebase/firestore";
import { db } from "../../../../../lib/firebase";

/**
 * Handles the GET request to fetch product details by product ID.
 *
 * @param {Request} req - The HTTP request object.
 * @param {Object} params - The parameters from the request context.
 * @param {string} params.productId - The ID of the product to be fetched.
 * @returns {Response} A response object containing the product data or an error message.
 */
export async function GET(req, { params }) {
  let { productId } = params;

  if (/^\d{1,2}$/.test(productId)) {
    productId = productId.padStart(3, "0");
  }

  if (typeof productId !== "string" || productId.trim() === "") {
    return new Response(JSON.stringify({ error: "Invalid Product ID" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }
  // Reference to the specific product document
  try {
    const productRef = doc(db, "products", productId);
    const productSnap = await getDoc(productRef);

    if (productSnap.exists()) {
      const productData = productSnap.data();
      console.log("Fetched Product Data:", productData);

      return new Response(
        JSON.stringify({
          product: {
            title: productData.title || "Title Not Available",
            description: productData.description || "Description Not Available",
            category: productData.category || "Category Not Available",
            price: productData.price || 0,
            rating: productData.rating || 0,
            images: productData.images || [],
            stock: productData.stock || 0,
            reviews: productData.reviews || [],
            tags: productData.tags || [],
          },
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }
      );
    } else {
      return new Response(JSON.stringify({ error: "Product not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }
  } catch (error) {
    console.error("Error fetching product:", error.message || error);
    return new Response(
      JSON.stringify({ error: "Failed to fetch product data" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
