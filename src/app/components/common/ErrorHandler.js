"use client";

/**
 * ErrorComponent displays an error message when no products are found.
 * It shows an icon and a message indicating that no products are currently available.
 * @returns {JSX.Element} A full-screen error message component.
 */
export default function ErrorComponent() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <div className="flex flex-col items-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-24 h-24 text-gray-500 mb-4"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9.172 14.828a4 4 0 015.656 0M9 9.75h.008v.008H9V9.75zm6 .008h.008V9.75H15v.008zM21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>

        <h1 className="text-2xl font-bold text-gray-700 mb-2">
          No product(s) found
        </h1>

        <p className="text-gray-500">
          It seems like there are no products available at the moment.
        </p>
      </div>
    </div>
  );
}
