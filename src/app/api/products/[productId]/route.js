// src/app/api/products/[productId]/route.js

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
      
      
      
}
  };