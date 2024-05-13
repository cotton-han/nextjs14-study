"use server";

import db from "@/lib/db";
import getSession from "@/lib/session";
import { revalidatePath } from "next/cache";

export async function deleteProduct(id: number) {
  const product = await db.product.findUnique({
    where: { id },
    select: { userId: true },
  });

  if (!product) return new Response("Product not found", { status: 404 });

  const session = await getSession();

  if (product?.userId !== session.id)
    return new Response("Permission denied", { status: 403 });

  await db.product.delete({
    where: { id },
  });

  revalidatePath("/home");
}
