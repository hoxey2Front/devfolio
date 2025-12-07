/**
 * HTML 태그를 제거하고 순수 텍스트만 추출하는 함수
 * @param html - HTML 문자열
 * @returns 태그가 제거된 순수 텍스트
 */
export function stripHtmlTags(html: string): string {
  // HTML 태그 제거
  const withoutTags = html.replace(/<[^>]*>/g, ' ');
  // 연속된 공백을 하나로 변환
  const normalized = withoutTags.replace(/\s+/g, ' ');
  // 앞뒤 공백 제거
  return normalized.trim();
}

/**
 * HTML 엔티티를 디코딩하는 함수
 * @param html - HTML 엔티티가 포함된 문자열
 * @returns 디코딩된 문자열
 */
export function decodeHtmlEntities(html: string): string {
  const entities: Record<string, string> = {
    '&lt;': '<',
    '&gt;': '>',
    '&amp;': '&',
    '&quot;': '"',
    '&#39;': "'",
    '&nbsp;': ' ',
  };

  return html.replace(/&[a-z]+;|&#\d+;/gi, (match) => entities[match] || match);
}

/**
 * HTML을 일반 텍스트로 변환 (태그 제거 + 엔티티 디코딩)
 * @param html - HTML 문자열
 * @returns 순수 텍스트
 */
export function htmlToPlainText(html: string): string {
  const withoutTags = stripHtmlTags(html);
  return decodeHtmlEntities(withoutTags);
}
