"use client";

import Button from "@/components/button";
import Input from "@/components/input";
import { PhotoIcon } from "@heroicons/react/24/solid";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { getUploadUrl, uploadProduct } from "./actions";
import { ProductType, productSchema } from "./schema";

export default function AddProduct() {
  const [preview, setPreview] = useState("");
  const [uploadURL, setUploadURL] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    setError,
    formState: { errors },
  } = useForm<ProductType>({
    resolver: zodResolver(productSchema),
  });

  const onImageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: { files },
    } = event;
    if (!files) {
      return;
    }
    const file = files[0];
    const url = URL.createObjectURL(file);
    setPreview(url);
    setFile(file);
    const { success, result } = await getUploadUrl();
    if (success) {
      const { id, uploadURL } = result;
      setUploadURL(uploadURL);
      setValue(
        "photo",
        `https://imagedelivery.net/YSXenLn9NIJNHJvTRrbCjA/${id}`
      );
    }
  };

  const onSubmit = handleSubmit(async (product: ProductType) => {
    if (!file) return;

    const cloudflareFormData = new FormData();
    cloudflareFormData.append("file", file);
    const res = await fetch(uploadURL, {
      method: "POST",
      body: cloudflareFormData,
    });
    if (!res.ok) return;

    const formData = new FormData();
    formData.append("photo", product.photo);
    formData.append("title", product.title);
    formData.append("price", product.price + "");
    formData.append("description", product.description);

    const errors = await uploadProduct(formData);
    if (errors) {
      // setError("photo", { message: errors.photo });
    }
  });

  const onValid = async () => {
    await onSubmit();
  };

  return (
    <div>
      <form className="p-5 flex flex-col gap-5" action={onValid}>
        <label
          htmlFor="photo"
          className="border-2 aspect-square flex items-center justify-center flex-col text-neutral-300 border-neutral-300 rounded-md border-dashed cursor-pointer bg-center bg-cover"
          style={{
            backgroundImage: `url(${preview})`,
          }}
        >
          {preview === "" && (
            <>
              <PhotoIcon className="w-20" />
              <div className="text-neutral-400 text-sm select-none">
                사진을 추가해주세요.
                {errors.photo?.message}
              </div>
            </>
          )}
        </label>
        {/* TODO: 업로드한 파일이 이미지인지, 크기가 5MB 이하인지에 대한 에러처리 */}
        <input
          onChange={onImageChange}
          type="file"
          id="photo"
          name="photo"
          accept="image/*"
          className="hidden"
        />
        <Input
          required
          placeholder="제목"
          type="text"
          errors={[errors.title?.message ?? ""]}
          {...register("title")}
        />
        <Input
          type="number"
          required
          placeholder="가격"
          errors={[errors.price?.message ?? ""]}
          {...register("price")}
        />
        <Input
          type="text"
          required
          placeholder="자세한 설명"
          errors={[errors.description?.message ?? ""]}
          {...register("description")}
        />
        <Button text="작성 완료" />
      </form>
    </div>
  );
}
