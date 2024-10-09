# SwiftCart E-Commerce Platform

SwiftCart is a responsive and dynamic e-commerce platform built with Next.js and React, offering a seamless shopping experience. It features robust product listings with search, filtering by categories, sorting by price, and pagination to help users easily find what they need. The detailed product pages display essential information such as price, stock, descriptions, tags, and customer reviews, with sorting options for reviews by date or rating. SwiftCart ensures that all search, filter, and sort options are reflected in the URL for easy sharing and bookmarking. The platform is fully responsive, optimized for SEO, and designed for scalability. Developers benefit from features like server-side rendering, image optimization, caching strategies, and a customizable architecture. SwiftCart is ideal for any online retail business looking for flexibility and growth potential.

# Table of Contents
- Technologies Used
- Features
- Setup Instructions
- Usage Examples

# Technologies Used
This project utilizes a variety of modern technologies to ensure a smooth and efficient experience for both users and developers.

- Next.js: For building server-side rendered and statically generated pages.
- React.js: For creating interactive user interfaces with a component-based architecture.
- Tailwind CSS: For utility-first, responsive styling.
- React Icons: For adding dynamic icons to the interface.
- Firebase: For fetching products and managing user authentication.
- Font Awesome (FA Icons): For adding icons to the cart, wishlist, and user profile sections.

# Features
- Responsive Layout: Adapts to all screen sizes, from mobile to desktop.
- Product Listing: Displays a paginated list of products fetched from Firebase.
- Product Details: Includes detailed product information, such as price, description, and images.
- Search Bar: Allows users to search for products by title or part of a title with real-time suggestions.
- Sort by Price: Enables sorting of products by price in ascending or descending order.
- Sort by Category: Allows users to filter products by category.
- URL Synchronization: The URL reflects search, filter, sort, and pagination options, making it easy to bookmark and share specific views.
- Pagination: If the filtered or sorted results exceed 20 products, they are paginated for easier navigation.
- Dynamic Meta Tags: SEO optimized meta tags, with dynamic titles and descriptions for each product page.
- Image Optimization: Uses Next.js built-in image optimization to ensure fast loading of product images.
- Product Reviews: Displays customer reviews, with the ability to sort reviews by date or rating.
- Carousel for Images: Enables users to navigate through product images.
- Error Handling: Custom error messages for scenarios where products or data cannot be fetched.
- Loading Spinner: Displays a spinner while content is loading.
- State Persistence: Search, sorting, and filtering preferences are retained even after navigating to the product detail page and returning to the product list.

# Setup Instructions
## Prerequisites
Before setting up the project, ensure you have the following installed:

- Node.js (v14.x or above)
- npm (v6.x or above)
- Git

## Steps to Run Locally
1. Clone the Repository:
   ```bash
   git clone [https://github.com/yourusername/swiftcart.git](https://github.com/IkanyengAdams/IKAADA488_BCL2407_GroupB_Ikanyeng-Adams_FSJ01.git)
   cd ./IKAADA488_BCL2407_GroupB_Ikanyeng-Adams_FSJ01


# Table of Contents
-Technologies Used

-Features

-Setup Instructions

-Usage Examples

# Technologies Used
This project utilizes a variety of modern technologies to ensure a smooth and efficient experience for both users and developers.

-Next.js: For building server-side rendered and statically generated pages.

-React.js: For creating interactive user interfaces with a component-based architecture.

-Tailwind CSS: For utility-first, responsive styling.

-React Icons: For adding dynamic icons to the interface.

-Firebase (cloud firestore): For fetching products [from a mock API.](https://next-ecommerce-api.vercel.app/)

-Font Awesome (FA Icons): For adding icons to the cart, wishlist, and user profile sections.

# Features
-Responsive Layout: Adapts to all screen sizes, from mobile to desktop.

-Product Listing: Displays a paginated list of products fetched from a remote API.

-Product Details: Includes detailed product information, such as price, description, and images.

-Search Bar: Allows users to search for products by title or part of a title with real-time suggestions.

-Sort by Price: Enables sorting of products by price in ascending or descending order.

-Sort by Category: Allows users to filter products by category.

-URL Synchronization: The URL reflects search, filter, sort, and pagination options, making it easy to bookmark and share specific views.

-Pagination: If the filtered or sorted results exceed 20 products, they are paginated for easier navigation.

Dynamic Meta Tags: SEO optimized meta tags, with dynamic titles and descriptions for each product page.

-Image Optimization: Uses Next.js built-in image optimization to ensure fast loading of product images.

-Product Reviews: Displays customer reviews, with the ability to sort reviews by date or rating.

-Carousel for Images: Enables users to navigate through product images.

-Error Handling: Custom error messages for scenarios where products or data cannot be fetched.

-Loading Spinner: Displays a spinner while content is loading.

-State Persistence: Search, sorting, and filtering preferences are retained even after navigating to the product detail page and returning to the product list.

# Setup Instructions
# Prerequisites
Before setting up the project, ensure you have the following installed:

-Node.js (v14.x or above)

-npm (v6.x or above)

-Git

# Steps to Run Locally
1.Clone the Repository:
  git clone [https://github.com/yourusername/swiftcart.git](https://github.com/IkanyengAdams/IKAADA488_BCL2407_GroupB_Ikanyeng-Adams_FSJ01.git)
  cd ./IKAADA488_BCL2407_GroupB_Ikanyeng-Adams_FSJ01
  
2.Install Dependencies Once inside the project directory, install the required packages:
  npm install
  
3.Run the Development Server After installing the dependencies, start the development server
  npm run dev
  
4.Open the Project in a Browser The app will run on http://localhost:3000 by default. Open this 
  URL in your web browser.

# Usage Examples
![Screenshot 2024-09-29 193506](https://github.com/user-attachments/assets/16f56000-1865-4c4e-a27f-bb58ee234eb0)
![Screenshot 2024-09-29 193616](https://github.com/user-attachments/assets/59568d06-4867-4b05-aa8b-86602965a521)
![Screenshot 2024-09-29 193654](https://github.com/user-attachments/assets/fc087318-e9bf-4542-bc3f-6571c90ceae1)

# Product Listing Page
  When you first open the app, you’ll be greeted with a list of products. The list is 
  paginated, and you can navigate between pages using "Previous" and "Next" buttons.
  
# Product Details Page
  Clicking on any product from the listing will take you to the product details page. Here, you 
  can view the product’s description, price, category, and customer reviews.

  # Search, Filter, and Sort Features
Use the Search Bar to find products by entering the product name.

Filter products using the Sort by Category dropdown.

Sort products by price using the Sort by Price dropdown (low to high or high to low).

The URL reflects your search, sorting, and filtering preferences, so you can easily share the specific view of products.

# Loading States and Error Handling
  If the data takes time to load, a spinner will be displayed to the user. If no products are 
  found or there’s a network error, a custom error message will be shown.
