import React from 'react';
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

export default function Verify() {
    const router = useRouter();
    const { token } = router.query;
    const [message, setMessage] = useState("Verifying your email...");

    useEffect(() => {
        if (token) {
            fetch('http://localhost:5001/api/auth/verify/${token}')
            .then((res) => res.json())
            .then((data) => {
                if (data.msg === "Email verified! You can now log in.") {
                    setMessage("Email verified successfully! Redirecting to login...");
                    setTimeout(() => {
                        router.push("/auth/signin");
                    }, 3000);
                } else {
                    setMessage("Invalid or expired verification link.");
                }
            })
            .catch(() => {
                setMessage("Error verifying email. Please try again.");
            });
        }
    }, [token, router]);

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
            <div className="bg-white p-6 rounded-lg shadow-md w-96 text-center">
                <h2 className="text-2xl font-bold mb-4">Email Verification</h2>
                <p className="text-gray-700">{message}</p>
            </div>
        </div>
    );
}