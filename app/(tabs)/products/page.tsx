import ProductList from "@/components/product-list";
import { PRODUCT_PAGE_SIZE } from "@/lib/constants";
import db from "@/lib/db";
import { PlusIcon } from "@heroicons/react/24/solid";
import { Prisma } from "@prisma/client";
import Link from "next/link";

async function getInitialProducts() {
  return db.product.findMany({
    select: {
      id: true,
      title: true,
      photo: true,
      created_at: true,
      price: true,
    },
    orderBy: {
      created_at: "desc",
    },
    take: PRODUCT_PAGE_SIZE,
  });
}

export type InitialProducts = Prisma.PromiseReturnType<
  typeof getInitialProducts
>;

export default async function ProductsPage() {
  const initialProducts = await getInitialProducts();

  return (
    <>
      <ProductList initialProducts={initialProducts} />
      <Link
        href="/products/add"
        className="bg-orange-500 flex items-center justify-center rounded-full size-16 fixed bottom-24 right-8 text-white transition-colors hover:bg-orange-400"
      >
        <PlusIcon className="size-10" />
      </Link>
    </>
  );
}
