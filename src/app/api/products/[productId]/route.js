

import { db } from '../../../../../lib/firebase';
import { doc, getDoc } from "firebase/firestore";

export async function GET(req, { params }) {
  const { productId } = params;

  try {
    const productRef = doc(db, "products", productId);
    const productSnap = await getDoc(productRef);

    if (productSnap.exists()) {
      const productData = productSnap.data();
      console.log("Fetched Product Data:", productData);

      return new Response(JSON.stringify({ 
        product: {
          title: productData.title || "Title Not Available",
          description: productData.description || "Description Not Available",
          category: productData.category || "Category Not Available",
          price: productData.price || 0, 
          rating: productData.rating || 0, 
          images: productData.images || [], 
          stock: productData.stock || 0,
          reviews: productData.reviews || [],
          tags: productData.tags || [] 
        } 
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    } else {
      return new Response(JSON.stringify({ error: 'Product not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  } catch (error) {
    console.error("Error fetching product:", error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
