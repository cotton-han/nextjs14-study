"use client";

import { useRouter } from "next/navigation";
import { deleteProduct } from "./actions";

interface Props {
  id: number;
}

export default function DeleteButton({ id }: Props) {
  const router = useRouter();

  const onDeleteProduct = async () => {
    const ok = confirm("Are you sure you want to delete this product?");
    if (ok) await deleteProduct(id);
    router.push("/home");
  };

  return (
    <button
      onClick={onDeleteProduct}
      className="bg-red-500 px-5 py-2.5 rounded-md text-white font-semibold"
    >
      Delete product
    </button>
  );
}
