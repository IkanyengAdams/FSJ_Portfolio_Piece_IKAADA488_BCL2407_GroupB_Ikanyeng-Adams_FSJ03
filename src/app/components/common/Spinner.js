/**
 * Spinner component displays a loading spinner animation.
 * It centers a spinning circle on the screen to indicate a loading state.
 * 
 * @returns {JSX.Element} A full-screen loading spinner component.
 */
export default function Spinner() {
  return (
    <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
    </div>
  );
}
