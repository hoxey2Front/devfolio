export interface Post {
  /** 포스트 고유 ID */
  id: string;
  /** 포스트 제목 */
  title: string;
  /** URL에 사용될 슬러그 (예: my-first-post) */
  slug: string;
  /** 발행 날짜 (ISO 8601 형식) */
  publishedAt: string;
  /** 주요 기술 스택 또는 주제 태그 목록 */
  tags: string[];
  /** 포스트의 요약 설명 */
  summary: string;
  /** 포스트의 전체 내용 (마크다운 등) */
  content: string;
}
