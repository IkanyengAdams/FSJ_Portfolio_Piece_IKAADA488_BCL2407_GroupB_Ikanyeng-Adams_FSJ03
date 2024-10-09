import { NextResponse } from "next/server";
import { db } from "../../../../lib/firebase";
import { collection, query, where, orderBy, getDocs } from "firebase/firestore";

/**
 * Handles the GET request to fetch products based on search parameters.
 *
 * @param {Request} request - The HTTP request object.
 * @returns {Promise<Response>} A JSON response containing the products and pagination information, or an error message.
 */
export async function GET(request) {
  const { searchParams } = new URL(request.url);

  const searchTerm = searchParams.get("searchTerm") || "";
  const category = searchParams.get("category") || "";
  const sortByPrice = searchParams.get("sortByPrice") || "";
  const page = parseInt(searchParams.get("page")) || 1;
  const productsPerPage = 20;

  try {
    let productQuery = collection(db, "products");
    // Apply search term filter if provided
    if (searchTerm) {
      productQuery = query(
        productQuery,
        where("title", ">=", searchTerm),
        where("title", "<=", searchTerm + "\uf8ff")
      );
    }

    // Apply category filter if provided
    if (category) {
      productQuery = query(productQuery, where("category", "==", category));
    }

    // Apply sorting by price if specified
    if (sortByPrice === "asc") {
      productQuery = query(productQuery, orderBy("price", "asc"));
    } else if (sortByPrice === "desc") {
      productQuery = query(productQuery, orderBy("price", "desc"));
    } else {
      productQuery = query(productQuery, orderBy("title"));
    }

    const allProductsSnapshot = await getDocs(productQuery);
    const allProducts = allProductsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    const offset = (page - 1) * productsPerPage;

    if (offset >= allProducts.length) {
      return NextResponse.json({ products: [], message: "No products found" });
    }

    const productsToReturn = allProducts.slice(
      offset,
      offset + productsPerPage
    );

    return NextResponse.json({
      products: productsToReturn,
      currentPage: page,
      totalPages: Math.ceil(allProducts.length / productsPerPage),
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}
