import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { adminId, adminPw } = await request.json();

    // 환경 변수에서 관리자 계정 정보 가져오기
    const ADMIN_ID = process.env.ADMIN_ID;
    const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

    // 환경 변수가 설정되지 않은 경우
    if (!ADMIN_ID || !ADMIN_PASSWORD) {
      return NextResponse.json(
        { success: false, message: '관리자 계정이 설정되지 않았습니다.' },
        { status: 500 }
      );
    }

    // 입력값 검증
    if (!adminId || !adminPw) {
      return NextResponse.json(
        { success: false, message: 'ID와 Password를 모두 입력해주세요.' },
        { status: 400 }
      );
    }

    // 관리자 계정 검증
    if (adminId === ADMIN_ID && adminPw === ADMIN_PASSWORD) {
      return NextResponse.json(
        { success: true, message: '로그인 성공' },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { success: false, message: 'ID 또는 Password가 올바르지 않습니다.' },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error('Admin login error:', error);
    return NextResponse.json(
      { success: false, message: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
