# Devfolio

**Front-End 개발자를 위한 포트폴리오 및 블로그 플랫폼**

Devfolio는 Next.js 15와 TypeScript를 기반으로 구축된 현대적인 개발자 포트폴리오 사이트입니다. 자신의 프로젝트를 효과적으로 소개하고, 기술 블로그를 운영할 수 있는 통합 환경을 제공합니다.

## ✨ 주요 기능

- **포트폴리오 쇼케이스**: 프로젝트의 핵심 정보, 기술 스택, 데모 링크 등을 카드 형태로 깔끔하게 전시합니다.
- **기술 블로그**:
  - **Tiptap 에디터**: Notion 스타일의 WYSIWYG 에디터를 통해 직관적으로 글을 작성할 수 있습니다.
  - **SLASH 명령**: `/` 명령어를 통해 제목, 리스트, 코드 블럭, 인용구 등을 빠르게 삽입할 수 있습니다.
  - **태그 필터링**: 태그별로 포스트를 모아볼 수 있는 기능을 제공합니다.
  - **보기 모드 전환**: 리스트 뷰와 그리드 뷰를 지원하여 사용자가 원하는 방식으로 콘텐츠를 탐색할 수 있습니다.
- **인터랙티브 UI**: Framer Motion을 활용한 부드러운 애니메이션과 전환 효과를 제공합니다.
- **다크 모드**: `next-themes`를 이용한 라이트/다크 모드 전환을 완벽하게 지원합니다.
- **반응형 디자인**: 모바일, 태블릿, 데스크탑 등 모든 디바이스에 최적화된 레이아웃을 제공합니다.

## 🛠 기술 스택

- **Framework**: [Next.js 15 (App Router)](https://nextjs.org/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **UI Components**: [Shadcn UI](https://ui.shadcn.com/) (Radix UI 기반)
- **Animation**: [Framer Motion](https://www.framer.com/motion/)
- **State Management**: [Zustand](https://github.com/pmndrs/zustand)
- **Data Fetching**: [TanStack Query (React Query)](https://tanstack.com/query/latest)
- **Editor**: [Tiptap](https://tiptap.dev/)
- **Backend / Database**: [Supabase](https://supabase.com/) (연동 예정/진행 중)
- **Deployment**: Vercel (권장)

## 🚀 시작하기 (Getting Started)

프로젝트를 로컬 환경에서 실행하려면 다음 단계를 따르세요.

### 1. 저장소 복제 (Clone)

```bash
git clone https://github.com/your-username/devfolio.git
cd devfolio
```

### 2. 패키지 설치 (Install Dependencies)

```bash
npm install
# 또는
yarn install
# 또는
pnpm install
```

### 3. 환경 변수 설정 (.env.local)

프로젝트 루트에 `.env.local` 파일을 생성하고 필요한 환경 변수를 설정하세요. (Supabase 관련 키 등)

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
# 기타 필요한 변수들...
```

### 4. 개발 서버 실행 (Run Development Server)

```bash
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어 결과를 확인하세요.

## 📁 프로젝트 구조

```
devfolio/
├── src/
│   ├── app/              # Next.js App Router 페이지 및 레이아웃
│   ├── components/       # 재사용 가능한 UI 컴포넌트
│   │   ├── common/       # 공통 컴포넌트 (버튼, 입력 필드 등)
│   │   ├── editor/       # Tiptap 에디터 관련 컴포넌트
│   │   ├── layout/       # 헤더, 푸터 등 레이아웃 컴포넌트
│   │   └── ...
│   ├── hooks/            # 커스텀 React Hooks
│   ├── lib/              # 유틸리티 함수 및 설정 (supabase 클라이언트 등)
│   ├── styles/           # 전역 스타일 (CSS)
│   └── types/            # TypeScript 타입 정의
├── public/               # 정적 파일 (이미지, 폰트 등)
├── next.config.ts        # Next.js 설정
├── package.json          # 의존성 및 스크립트 관리
└── ...
```

## 📜 라이선스

이 프로젝트는 [MIT License](LICENSE)를 따릅니다.
