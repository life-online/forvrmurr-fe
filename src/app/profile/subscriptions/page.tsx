"use client";

import ProfileLayout from "@/components/profile/ProfileLayout";

export default function SubscriptionsPage() {
  return (
    <ProfileLayout>
      <div className="py-20 text-center text-gray-600">
        <p className="font-serif text-xl mb-2">Subscriptions are currently unavailable.</p>
        <p>Please check back later for updates.</p>
      </div>
    </ProfileLayout>
  );
}