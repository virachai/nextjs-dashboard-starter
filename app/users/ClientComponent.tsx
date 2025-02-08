'use client';

import React from 'react';
import { use } from 'react';

export default function ClientComponent({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div>{children}</div>;
}

interface CommentsProps {
  commentsPromise: Promise<string[]>;
}

export function Comments({ commentsPromise }: CommentsProps) {
  // Using the `use` hook to resolve the comments promise.
  const comments = use(commentsPromise);

  return (
    <div>
      {comments.map((comment, index) => (
        <p key={index}>{comment}</p>
      ))}
    </div>
  );
}
