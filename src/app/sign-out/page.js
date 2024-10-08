"use client";

import { useRouter } from "next/navigation"; 
import { auth } from "../../../lib/firebase";
import { signOut } from "firebase/auth";
import { useState } from "react";

export default function SignOut() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSignOut = async () => {
    setLoading(true);
    try {
      await signOut(auth);
      setLoading(false);
      router.push("/");
    } catch (error) {
      setLoading(false);
      console.error("Error signing out: ", error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <div className="bg-gray-800 p-8 rounded-lg shadow-md w-full max-w-md text-center">
        <h2 className="text-3xl font-bold mb-6 text-white">Are you sure you want to sign out?</h2>
        
        <button
          onClick={handleSignOut}
          disabled={loading}
          className={`w-full py-2 px-4 bg-red-600 text-white font-semibold rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 hover:bg-red-700 mb-4 ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {loading ? "Signing Out..." : "Yes, Sign Out"}
        </button>

        <button
          onClick={() => router.push("/")}
          className="w-full py-2 px-4 bg-gray-600 text-white font-semibold rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 hover:bg-gray-700"
        >
          No, Take Me Back
        </button>
      </div>
    </div>
  );
}
