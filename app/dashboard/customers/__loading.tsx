// // app/dashboard/(overview)/loading.tsx
// import { shimmer } from '@/app/ui/skeletons';
// import CustomersTable from '@/app/ui/customers/table';
// import { Metadata } from 'next';
// import { v4 as uuidv4 } from 'uuid';
// import {
//   // CustomersTableType,
//   FormattedCustomersTable,
// } from '@/app/lib/definitions';

// export const metadata: Metadata = {
//   title: 'Customers',
// };

// export default async function Page(props: {
//   searchParams?: Promise<{
//     query?: string;
//     page?: string;
//   }>;
// }) {
//   // Create an array of customers, following the FormattedCustomersTable structure
//   const customers: FormattedCustomersTable[] = new Array(6)
//     .fill(null)
//     .map(() => ({
//       id: uuidv4(),
//       name: 'name',
//       email: 'email',
//       image_url: '',
//       total_invoices: 0,
//       total_pending: '$',
//       total_paid: '$',
//     }));

//   return (
//     <main className={`${shimmer}`}>
//       <CustomersTable customers={customers} />
//     </main>
//   );
// }
