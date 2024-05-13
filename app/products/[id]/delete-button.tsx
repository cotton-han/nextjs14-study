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
    router.push("/products");
    // 이동하면 삭제된 상품이 보이는 문제가 있음
    // 페이징 캐싱을 해제하는 방법
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
