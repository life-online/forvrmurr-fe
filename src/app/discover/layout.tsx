"use client";
import AnnouncementBar from "@/components/layout/AnnouncementBar";
import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";
import React from "react";

export default function DiscoverPageLayout ({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen bg-white flex flex-col">
            <AnnouncementBar message="New collection revealed monthly!" />
            <Navbar />
            {children}
            <Footer />
        </div>
    );
}
