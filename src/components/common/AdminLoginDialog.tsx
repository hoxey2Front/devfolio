'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useAdmin } from "@/contexts/AdminContext";
import { toast } from "sonner";

interface LoginFormInputs {
  adminId: string;
  adminPw: string;
}

const loginSchema = z.object({
  adminId: z.string().min(1, "ID를 입력해주세요."),
  adminPw: z.string().min(1, "Password를 입력해주세요."),
});

interface AdminLoginDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onLoginSuccess: () => void;
}

const AdminLoginDialog = ({ open, onOpenChange, onLoginSuccess }: AdminLoginDialogProps) => {
  const { login } = useAdmin();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<LoginFormInputs>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      adminId: "",
      adminPw: "",
    },
  });

  const onSubmit: SubmitHandler<LoginFormInputs> = async (data) => {
    try {
      await login(data.adminId, data.adminPw);

      toast.success('관리자 모드로 진입합니다.');
      onLoginSuccess();
      onOpenChange(false);
      reset();
    } catch (error) {
      console.error('Login error:', error);

      let errorMessage = '로그인에 실패했습니다. ID(이메일)와 비밀번호를 확인해주세요.';

      if (error && typeof error === 'object' && 'message' in error) {
        errorMessage = (error as { message: string }).message;
      }

      toast.error(errorMessage);

      // 실패 시 Password 필드만 초기화
      reset({ adminId: data.adminId, adminPw: '' });
    }
  };

  const handleOpenChange = (open: boolean) => {
    onOpenChange(open);
    if (!open) {
      reset();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>관리자 로그인</DialogTitle>
          <DialogDescription>
            관리자 모드로 진입하려면 ID와 Password를 입력해주세요.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-6 pt-12">

          {/* ID 입력 필드 */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="adminId">
              ID
            </Label>
            <Input
              id="adminId"
              {...register("adminId")}
              className="col-span-3"
            />
          </div>
          {errors.adminId && (
            <p className="text-destructive text-sm mt-1">
              {errors.adminId.message}
            </p>
          )}

          {/* Password 입력 필드 */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="adminPw">
              Password
            </Label>
            <Input
              id="adminPw"
              type="password"
              {...register("adminPw")}
              className="col-span-3"
            />
          </div>
          {errors.adminPw && (
            <p className="text-destructive text-sm mt-1">
              {errors.adminPw.message}
            </p>
          )}

          <DialogFooter className="mt-4">
            <Button
              className="w-full"
              variant={'gradient'}
              type="submit"
              disabled={isSubmitting}>
              {isSubmitting ? "로그인 중..." : "로그인"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AdminLoginDialog;