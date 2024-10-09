import { Suspense } from "react";
import ProductsView from "./productView";
import ProductsViewskeleton from "./productViewSkeleton";
/**
 * Displays a page of products with search and sort functionality.
 * @returns {JSX.Element} The ProductsPage component.
 */
export default function ProductsPage() {
  
  return (
    <Suspense fallback={<ProductsViewskeleton />}>
    <ProductsView />
   </Suspense>
  );
}
