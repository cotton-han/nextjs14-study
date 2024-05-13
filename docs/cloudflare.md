# Cloudflare

- 이미지 업로드
  - 유저 이미지 업로드 -> 서버에서 Cloudflare 서버에 요청 -> 안전한 업로드 URL 응답 -> 유저에게 전달
  - form의 submit 버튼 클릭 -> Cloudflare 업로드 -> 업로드된 URL을 DB에 저장
- [Request a one-time upload URL](https://developers.cloudflare.com/images/upload-images/direct-creator-upload)
  - form을 submit할 때 요청해도되지만 그럼 업로드 프로세스가 좀 더 오래 걸릴 수 있으므로 파일 업로드하는 시점에 요청
  - 사용자가 페이지를 닫고 나가버리면 해당 URL은 만료됨
  - 업로드 URL을 생성만 하는건 무료 -> 곧 올라올 사진을 위해 서버에 공간을 만드는 것뿐 사용하지 않아도 무방
- AWS S3와의 차이점
  - 이미지 변형 (품질 변형, 크롭 기능 등 이미지에 최적화)
- Variants
  - [설정 페이지](https://dash.cloudflare.com/b15d1f020ed9f5ac9b589df1b2daca07/images/variants)
  - Flexible variants : 동적으로 이미지 크기를 조정할 수 있음
    - Add New Variant 가 필요없음
    - url parameter로 조정 가능
    - [파라미터 종류](https://developers.cloudflare.com/images/transform-images/transform-via-url/#options)

## 구현 예시

1. 브라우저를 통해 이미지를 업로드하면 Cloudflare의 on-time upload URL 요청으로 업로드 URL을 얻는다.

   ```ts
   const onImageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
     const {
       target: { files },
     } = event;
     // 이미지 preview를 위한 과정
     if (!files) {
       return;
     }
     const file = files[0];
     const url = URL.createObjectURL(file);
     setPreview(url);
     // 업로드 URL을 얻는 과정
     const { success, result } = await getUploadUrl();
     if (success) {
       const { id, uploadURL } = result;
       setUploadURL(uploadURL);
       setImageId(id);
     }
   };
   ```

2. form의 submit을 통해 action이 호출되는데 이떄 FormData로 넘어오는 이미지 데이터가 File 타입이므로 string 데이터로 변환하기위해 interceptAction을 추가 구현한다.

   ```ts
   const interceptAction = async (_: any, formData: FormData) => {
     const file = formData.get("photo");
     if (!file) return;

     // 이미지 업로드
     const cloudflareFormData = new FormData();
     cloudflareFormData.append("file", file);
     const res = await fetch(uploadURL, {
       method: "POST",
       body: cloudflareFormData,
     });
     if (!res.ok) return;

     // 업로드된 이미지 주소 재설정
     const photoURL = `https://imagedelivery.net/YSXenLn9NIJNHJvTRrbCjA/${imageId}`;
     formData.set("photo", photoURL);

     // 기존 action 호출
     return uploadProduct(_, formData); // 반드시 return 해야함
   };

   const [state, action] = useFormState(interceptAction, null);
   ```

3. next.config 파일에서 `hostname: "imagedelivery.net"` 추가
4. img src에 /public, /avatar 등 추가
   - 원한다면 어드민 패널에서 별도의 Variants를 추가할 수 있음
   - 아니면 Flexible variants를 활성화시켜서 다양한 변형을 할 수 있음
