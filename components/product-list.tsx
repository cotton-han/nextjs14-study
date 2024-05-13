"use client";

import { getMoreProducts } from "@/app/(tabs)/home/actions";
import { InitialProducts } from "@/app/(tabs)/home/page";
import { useEffect, useRef, useState } from "react";
import ProductListItem from "./product-list-item";

interface Props {
  initialProducts: InitialProducts;
}

export default function ProductList({ initialProducts }: Props) {
  const [products, setProducts] = useState(initialProducts);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [isLastPage, setIsLastPage] = useState(false);

  const trigger = useRef<HTMLSpanElement>(null);

  const loadMore = async () => {
    setIsLoading(true);
    const newProducts = await getMoreProducts(page);
    if (newProducts.length !== 0) {
      setPage((prev) => prev + 1);
      setProducts((prev) => [...prev, ...newProducts]);
    } else {
      setIsLastPage(true);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    // TODO: 이해 필요
    const observer = new IntersectionObserver(
      async (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting && trigger.current && !isLoading) {
          observer.unobserve(trigger.current);
          await loadMore();
        }
      },
      { threshold: 0 }
    );
    if (trigger.current) observer.observe(trigger.current);
    return () => {
      observer.disconnect();
    };
  }, [page]);

  return (
    <div className="p-5 flex flex-col gap-5">
      {products.map((product) => (
        <ProductListItem key={product.id} {...product} />
      ))}
      {/* {!isLastPage && (
        <button
          onClick={loadMore}
          disabled={isLoading}
          className="text-sm font-semibold bg-orange-500 w-fit mx-auto px-3 py-2 rounded-md hover:opacity-90 active:scale-95"
        >
          {isLoading ? "로딩 중..." : "더보기"}
        </button>
      )} */}
      {!isLastPage && <span ref={trigger} className="invisible"></span>}
    </div>
  );
}
