'use client';

import React from 'react';
import SideNav from '@/app/ui/dashboard/sidenav';
import { useState, useEffect } from 'react';

export default function Layout({ children }: { children: React.ReactNode }) {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    // const intervalId = setInterval(() => {
    //   setCurrentTime(new Date());
    // }, 1000); // Update every second

    // return () => clearInterval(intervalId);
    setCurrentTime(new Date());
  }, []);

  return (
    <div className="flex h-screen flex-col md:flex-row md:overflow-hidden">
      <div className="w-full flex-none md:w-64">
        <SideNav />
      </div>
      <div className="flex-grow p-6 md:overflow-y-auto md:p-12">
        <div className="hidden">
          {/* Display current time */}
          <span>Current Time: {currentTime.toLocaleTimeString()}</span>
        </div>
        {children}
      </div>
    </div>
  );
}
