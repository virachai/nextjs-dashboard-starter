// Simulate a database with mock data
interface Note {
  id: number;
  content: string;
}

interface Comments {
  [key: number]: string[];
}

const notesData: Note[] = [
  { id: 1, content: 'This is the first note' },
  { id: 2, content: "Here's another note" },
  { id: 3, content: 'Last note in the list' },
];

const commentsData: Comments = {
  1: ['First comment', 'Second comment for note 1'],
  2: ['Comment for note 2'],
  3: ['One comment for note 3'],
};

// Mock the async database calls with delay (simulating real DB queries)
export const db = {
  notes: {
    get: async (id: number): Promise<Note | undefined> => {
      // Simulating async fetch with a delay
      await new Promise((resolve) => setTimeout(resolve, 500));
      return notesData.find((note) => note.id === id);
    },
  },

  comments: {
    get: async (noteId: number): Promise<string[]> => {
      // Simulating async fetch with a delay
      await new Promise((resolve) => setTimeout(resolve, 500));
      return commentsData[noteId] || [];
    },
  },
};
