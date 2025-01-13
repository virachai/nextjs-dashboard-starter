'use client';

import { useState, useEffect } from 'react';

export default function Template({ children }: { children: React.ReactNode }) {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    setCurrentTime(new Date());
  }, []);
  return (
    <div>
      <div className="hidden">
        {/* Display current time */}
        <span>Current Time: {currentTime.toLocaleTimeString()}</span>
      </div>
      {children}
    </div>
  );
}
