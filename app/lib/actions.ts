// app/lib/actions.ts
'use server';

import { z } from 'zod';
import postgres from 'postgres';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import DOMPurify from 'dompurify';
import { JSDOM } from 'jsdom';

const { window } = new JSDOM('');
const domPurify = DOMPurify(window);

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

const FormSchema = z.object({
  id: z.string().uuid(),
  customerId: z.string().min(1, { message: 'Customer ID is required' }),
  amount: z.coerce.number().gt(0, { message: 'Amount must be greater than 0' }),
  status: z.enum(['pending', 'paid']),
  date: z.string(),
});

const CreateInvoice = FormSchema.omit({ id: true, date: true });
const UpdateInvoice = FormSchema.omit({ id: true, date: true });
const UUIDSchema = z.string().uuid({ message: 'Invalid UUID format' });

function sanitizeInput(input: string): string {
  return domPurify.sanitize(input);
}

export async function createInvoice(formData: FormData) {
  const rawFormData = {
    customerId: formData.get('customerId'),
    amount: formData.get('amount'),
    status: formData.get('status'),
  };

  const sanitizedFormData = {
    customerId: sanitizeInput(rawFormData.customerId as string),
    amount: rawFormData.amount,
    status: sanitizeInput(rawFormData.status as string),
  };

  const { customerId, amount, status } = CreateInvoice.parse(sanitizedFormData);
  const amountInCents = amount * 100;
  const date = new Date().toISOString().split('T')[0];

  try {
    await sql`
      INSERT INTO invoices (customer_id, amount, status, date)
      VALUES (${customerId}, ${amountInCents}, ${status}, ${date})
    `;
  } catch (error) {
    // Log the error to the console for now
    console.error('Error inserting invoice:', error);
  }

  revalidatePath('/dashboard/invoices');
  redirect('/dashboard/invoices');
}

export async function updateInvoice(id: string, formData: FormData) {
  // Validate the ID
  try {
    UUIDSchema.parse(id);
  } catch (error) {
    throw new Error(
      `Invalid UUID format for invoice ID: ${JSON.stringify(error)}`
    );
  }

  const rawFormData = {
    customerId: formData.get('customerId'),
    amount: formData.get('amount'),
    status: formData.get('status'),
  };

  const sanitizedFormData = {
    customerId: sanitizeInput(rawFormData.customerId as string),
    amount: rawFormData.amount,
    status: sanitizeInput(rawFormData.status as string),
  };

  const { customerId, amount, status } = UpdateInvoice.parse(sanitizedFormData);
  const amountInCents = amount * 100;

  try {
    await sql`
      UPDATE invoices
      SET customer_id = ${customerId}, amount = ${amountInCents}, status = ${status}
      WHERE id = ${id}
    `;
  } catch (error) {
    // Log the error to the console for now
    console.error('Error updating invoice:', error);
  }

  revalidatePath('/dashboard/invoices');
  redirect('/dashboard/invoices');
}

export async function deleteInvoice(id: string) {
  try {
    UUIDSchema.parse(id);
  } catch (error) {
    throw new Error(
      `Invalid UUID format for invoice ID: ${JSON.stringify(error)}`
    );
  }

  try {
    await sql`DELETE FROM invoices WHERE id = ${id}`;
  } catch (error) {
    // Log the error to the console for now
    console.error('Error deleting invoice:', error);
  }

  revalidatePath('/dashboard/invoices');
}
