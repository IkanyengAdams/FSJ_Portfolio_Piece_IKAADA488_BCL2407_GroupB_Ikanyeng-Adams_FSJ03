"use client";

import { useState } from "react";
import { useRouter } from "next/navigation"; 
import { auth } from "../../../lib/firebase";

export default function SignUp() {
  

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <div className="bg-gray-800 p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-white">Sign Up</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        
      </div>
    </div>
  );
}
