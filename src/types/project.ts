export interface Project {
  /** 프로젝트 고유 ID */
  id: string;
  /** 프로젝트 이름 */
  title: string;
  /** 프로젝트에 대한 한 줄 요약 */
  summary: string;
  /** 사용된 기술 스택 목록 */
  techStacks: string[];
  /** 프로젝트 GitHub 링크 */
  githubLink: string;
  /** 프로젝트 배포 링크 */
  deployLink: string;
  /** 프로젝트 썸네일 이미지 URL */
  thumbnailUrl: string;
  /** 상세 설명 (선택 사항, 추후 추가) */
  description?: string;
  /** 개발 시작일/종료일 (선택 사항) */
  period?: {
    start: string;
    end: string;
  };
}
