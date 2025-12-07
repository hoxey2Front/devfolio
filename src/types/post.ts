export interface Post {
  id: string;
  title: string;
  summary: string;
  content: string;
  publishedAt: string; // ISO 8601 형식의 문자열 가정
  tags: string[];
  coverImage?: string; // 표지 이미지 URL
  author?: {
    name: string;
    avatar?: string;
  };
}

export interface PostFormFields {
  title: string;
  slug: string;
  publishedAt: string;
  tags: string; // 쉼표로 구분된 문자열로 입력받을 것입니다.
  summary: string;
  content: string;
}
