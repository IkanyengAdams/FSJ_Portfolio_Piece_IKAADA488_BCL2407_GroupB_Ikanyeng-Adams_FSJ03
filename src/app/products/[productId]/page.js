


import ProductDetail from "./productDetail";
/**
 * ProductDetail component displays the details of a single product including images, rating, and reviews.
 * @param {Object} props - The props object for the ProductDetail component.
 * @param {Object} props.params - The dynamic route parameters containing the productId.
 * @returns {JSX.Element} The ProductDetail component.
 */
export default function ProductDetailPage({ params }) {
  
    return (
     <ProductDetail/>
  );
}
