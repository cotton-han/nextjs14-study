"use server";

import { PRODUCT_PAGE_SIZE } from "@/lib/constants";
import db from "@/lib/db";

export async function getMoreProducts(page: number) {
  const products = await db.product.findMany({
    select: {
      title: true,
      price: true,
      created_at: true,
      photo: true,
      id: true,
    },
    skip: page * PRODUCT_PAGE_SIZE,
    take: PRODUCT_PAGE_SIZE,
    orderBy: {
      created_at: "desc",
    },
  });
  return products;
}
