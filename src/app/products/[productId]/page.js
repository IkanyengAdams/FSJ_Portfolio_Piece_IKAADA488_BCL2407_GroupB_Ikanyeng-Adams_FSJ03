import ProductDetail from "./productDetail";

/**
 * ProductDetailPage component serves as a wrapper for the ProductDetail component.
 * @param {Object} props - The props object for the ProductDetailPage component.
 * @param {Object} props.params - The dynamic route parameters containing the productId.
 * @returns {JSX.Element} The ProductDetail component.
 */
export default function ProductDetailPage({ params }) {
  return <ProductDetail params={params} />;
}
