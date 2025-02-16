// app/lib/actions.ts
'use server';

import { z } from 'zod';
import postgres from 'postgres';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import sanitizeHtml from 'sanitize-html';
import { signIn } from '@/auth';
import { AuthError } from 'next-auth';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

const FormSchema = z.object({
  id: z.string(),
  customerId: z.string({
    message: 'Please select a customer.',
  }),
  amount: z.coerce
    .number({
      message: 'Expected number.',
    })
    .gt(0, { message: 'Please enter an amount greater than $0.' }),
  status: z.enum(['pending', 'paid'], {
    message: 'Please select an invoice status.',
  }),
  date: z.string(),
});

const CreateInvoice = FormSchema.omit({ id: true, date: true });
const UpdateInvoice = FormSchema.omit({ id: true, date: true });
const UUIDSchema = z.string().uuid({ message: 'Invalid UUID format' });

export type State = {
  errors?: {
    customerId?: string[];
    amount?: string[];
    status?: string[];
  };
  message?: string | null;
};

function sanitizeInput(input: string): string {
  // Use sanitize-html to sanitize input
  return sanitizeHtml(input, {
    allowedTags: [], // Remove all tags by default
    allowedAttributes: {}, // Remove all attributes by default
  });
}

export async function createInvoice(prevState: State, formData: FormData) {
  const validatedFields = CreateInvoice.safeParse({
    customerId: formData.get('customerId'),
    amount: formData.get('amount'),
    status: formData.get('status'),
  });

  if (!validatedFields.success) {
    return Object.assign({}, prevState, {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Create Invoice.',
    });
  }

  const { customerId, amount, status } = validatedFields.data;
  const amountInCents = amount * 100;
  const date = new Date().toISOString().split('T')[0];
  const sanitizedCustomerId = sanitizeInput(customerId);

  try {
    await sql`
      INSERT INTO invoices (customer_id, amount, status, date)
      VALUES (${sanitizedCustomerId}, ${amountInCents}, ${status}, ${date})
    `;
  } catch (error) {
    const message = 'Database Error: Failed to Create Invoice.';
    console.error(message, error);
    return Object.assign({}, prevState, {
      message: message,
    });
  }

  revalidatePath('/dashboard/invoices');
  redirect('/dashboard/invoices');
}

export async function updateInvoice(
  id: string,
  prevState: State,
  formData: FormData
) {
  try {
    UUIDSchema.parse(id);
  } catch (error) {
    throw new Error(
      `Invalid UUID format for invoice ID: ${JSON.stringify(error)}`
    );
  }

  const validatedFields = UpdateInvoice.safeParse({
    customerId: formData.get('customerId'),
    amount: formData.get('amount'),
    status: formData.get('status'),
  });

  if (!validatedFields.success) {
    return Object.assign({}, prevState, {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Update Invoice.',
    });
  }

  const { customerId, amount, status } = validatedFields.data;
  const amountInCents = amount * 100;
  const sanitizedCustomerId = sanitizeInput(customerId);

  try {
    await sql`
      UPDATE invoices
      SET customer_id = ${sanitizedCustomerId}, amount = ${amountInCents}, status = ${status}
      WHERE id = ${id}
    `;
  } catch (error) {
    const message = 'Database Error: Failed to Update Invoice.';
    console.error(message, error);
    return Object.assign({}, prevState, {
      message: message,
    });
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
    console.error('Error deleting invoice:', error);
  }

  revalidatePath('/dashboard/invoices');
}

export async function authenticate(
  prevState: string | undefined,
  formData: FormData
) {
  try {
    await signIn('credentials', formData);

    return prevState;
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return 'Invalid credentials.';
        default:
          return 'Something went wrong.';
      }
    }
    throw error;
  }
}
