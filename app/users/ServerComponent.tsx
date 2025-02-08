// Server Component
import { db } from '@/app/lib/database';
import { Suspense } from 'react';
import { Comments } from './ClientComponent';

interface PageProps {
  id: number;
}

export default async function ServerComponent({ id }: PageProps) {
  const note = await db.notes.get(id);

  // NOTE: not awaited, will start here and await on the client.
  const commentsPromise = db.comments.get(note?.id || 0);
  return (
    <div>
      {note?.content}
      <Suspense fallback={<p>Loading Comments...</p>}>
        <Comments commentsPromise={commentsPromise} />
      </Suspense>
    </div>
  );
}

// // Client Component
// "use client";
// import {use} from 'react';

// function Comments({commentsPromise}) {
//   // NOTE: this will resume the promise from the server.
//   // It will suspend until the data is available.
//   const comments = use(commentsPromise);
//   return comments.map(commment => <p>{comment}</p>);
// }

// import { Suspense } from 'react';
// import { GetServerSideProps } from 'next';
// import { db } from '../database'; // Import the mock database

// // Server-Side rendering function (fetches data on page load)
// export const getServerSideProps: GetServerSideProps = async ({ params }) => {
//   const { id } = params!; // Get ID from the URL params
//   const note = await db.notes.get(Number(id)); // Fetch note by ID
//   const commentsPromise = db.comments.get(note?.id || 0); // Fetch comments for the note

//   // Return data as props to the page component
//   return {
//     props: {
//       note,
//       commentsPromise,
//     },
//   };
// };

// // Main Page Component
// interface PageProps {
//   note: {
//     id: number;
//     content: string;
//   };
//   commentsPromise: Promise<string[]>; // Comments data is a promise
// }

// const NotePage: React.FC<PageProps> = ({ note, commentsPromise }) => {
//   return (
//     <div>
//       <h1>{note.content}</h1>
//       <Suspense fallback={<p>Loading Comments...</p>}>
//         <Comments commentsPromise={commentsPromise} />
//       </Suspense>
//     </div>
//   );
// };

// export default NotePage;

// // Client-Side Comments Component
// ('use client');
// import { use } from 'react';

// interface CommentsProps {
//   commentsPromise: Promise<string[]>; // This is a Promise containing the comments
// }

// function Comments({ commentsPromise }: CommentsProps) {
//   // Suspense will suspend the component until the promise is resolved
//   const comments = use(commentsPromise);

//   return (
//     <div>
//       {comments.map((comment, index) => (
//         <p key={index}>{comment}</p>
//       ))}
//     </div>
//   );
// }
