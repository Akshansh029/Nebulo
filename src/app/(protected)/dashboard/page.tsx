"use client";
import { SignOutButton, useUser } from "@clerk/nextjs";
import React from "react";

const Dashboard = () => {
  const { user } = useUser();
  return (
    <div className="flex flex-col gap-4">
      <p className="text-2xl">Dashboard</p>
      <p className="text-2xl font-bold text-indigo-400">
        {user?.firstName} {user?.lastName}
      </p>
      <SignOutButton />
    </div>
  );
};

export default Dashboard;
