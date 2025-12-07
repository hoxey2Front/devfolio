import { AnimateIcon } from '@/components/animate-ui/icons/icon';
import { RefreshCw } from '@/components/animate-ui/icons/refresh-cw';
import { Button } from '@/components/ui/button';
import React from 'react';

// 굳이 props가 필요하지 않지만, 확장성을 고려하여 interface 구조를 유지합니다.
interface ReloadButtonProps {
  /** 버튼에 표시될 텍스트입니다. */
  buttonText?: string;
  /** 버튼 클릭 시 호출될 함수입니다. (기본값: window.location.reload) */
  onClick?: () => void;
}

/**
 * 클릭 시 현재 화면을 새로고침하는 버튼 컴포넌트입니다.
 * @param {ReloadButtonProps} props - 버튼 속성
 * @returns {JSX.Element} 새로고침 버튼
 */
const ReloadButton: React.FC<ReloadButtonProps> = ({
  buttonText = '',
  onClick
}) => {

  /**
   * 실제로 새로고침을 처리하는 함수입니다.
   */
  const handleReload = () => {
    if (onClick) {
      onClick();
    } else {
      // onClick prop이 없을 경우 기본 새로고침 로직 실행
      window.location.reload();
      console.log('화면 새로고침을 시도합니다...');
    }
  };

  return (
    <Button
      onClick={handleReload}
      variant={'destructive'}
    >
      <AnimateIcon animateOnHover className='flex justify-center items-center py-2 px-4'>
        <RefreshCw className='size-6' />
        <span className='ml-2'>{buttonText}</span>
      </AnimateIcon>
    </Button>
  );
};

export default ReloadButton;