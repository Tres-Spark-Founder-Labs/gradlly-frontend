/**
 * Global TanStack Query hooks for authentication.
 * All auth queries AND mutations live in this single file.
 * Import from @/features/auth within apps/main.
 */
import { useMutation, useQuery } from "@tanstack/react-query";

import { authKeys } from "../querykeys";
import {
  changePassword,
  disableMFA,
  forgotPassword,
  getMe,
  getSessions,
  resetPassword,
  revokeAllOtherSessions,
  revokeSession,
  setupMFA,
  signIn,
  signOut,
  signUp,
  updateProfile,
  verifyEmail,
  verifyMFA,
} from "../services";

import type {
  ChangePasswordPayload,
  ForgotPasswordPayload,
  MFAVerifyPayload,
  ResetPasswordPayload,
  SignInPayload,
  SignUpPayload,
  UpdateProfilePayload,
} from "../types";

import { getBrowserQueryClient } from "@/lib/react-query";

export const useCurrentUser = (): {
  user: Awaited<ReturnType<typeof getMe>> | undefined;
  isLoading: boolean;
  isAuthenticated: boolean;
  isError: boolean;
  error: Error | null;
} => {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: authKeys.me(),
    queryFn: getMe,
    staleTime: 10 * 60 * 1000,
    retry: false,
  });

  return {
    user: data,
    isLoading,
    isAuthenticated: data !== undefined,
    isError,
    error: error as Error | null, // react-query unknown error narrowed for consumer ergonomics.
  };
};

export const useSessions = (): {
  sessions: Awaited<ReturnType<typeof getSessions>> | undefined;
  currentSession: Awaited<ReturnType<typeof getSessions>>[number] | undefined;
  isLoading: boolean;
  isError: boolean;
} => {
  const { data, isLoading, isError } = useQuery({
    queryKey: authKeys.sessions(),
    queryFn: getSessions,
    staleTime: 2 * 60 * 1000,
  });

  return {
    sessions: data,
    currentSession: data?.find((session) => session.isCurrent),
    isLoading,
    isError,
  };
};

export const useSignIn = (): {
  signIn: (payload: SignInPayload) => void;
  isPending: boolean;
  isError: boolean;
  error: Error | null;
  isSuccess: boolean;
} => {
  const queryClient = getBrowserQueryClient();
  const mutation = useMutation({
    mutationFn: (payload: SignInPayload) => signIn(payload),
    onSuccess: (response) => {
      // Tokens are managed as httpOnly cookies by the API server.
      // We only update the user cache here — never store tokens
      // in localStorage or React state.
      queryClient.setQueryData(authKeys.me(), response.user);
    },
  });

  return {
    signIn: mutation.mutate,
    isPending: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error as Error | null, // mutation.error is unknown by default.
    isSuccess: mutation.isSuccess,
  };
};

export const useSignOut = (): { signOut: () => void; isPending: boolean } => {
  const queryClient = getBrowserQueryClient();
  const mutation = useMutation({
    mutationFn: signOut,
    onSuccess: () => {
      queryClient.clear();
    },
  });

  return { signOut: mutation.mutate, isPending: mutation.isPending };
};

export const useSignUp = (): {
  signUp: (payload: SignUpPayload) => void;
  isPending: boolean;
  isError: boolean;
  error: Error | null;
  isSuccess: boolean;
} => {
  const queryClient = getBrowserQueryClient();
  const mutation = useMutation({
    mutationFn: (payload: SignUpPayload) => signUp(payload),
    onSuccess: (response) => {
      queryClient.setQueryData(authKeys.me(), response.user);
    },
  });

  return {
    signUp: mutation.mutate,
    isPending: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error as Error | null, // mutation.error is unknown by default.
    isSuccess: mutation.isSuccess,
  };
};

export const useForgotPassword = (): {
  forgotPassword: (payload: ForgotPasswordPayload) => void;
  isPending: boolean;
  isSuccess: boolean;
  isError: boolean;
  error: Error | null;
} => {
  const mutation = useMutation({
    mutationFn: (payload: ForgotPasswordPayload) => forgotPassword(payload),
  });

  return {
    forgotPassword: mutation.mutate,
    isPending: mutation.isPending,
    isSuccess: mutation.isSuccess,
    isError: mutation.isError,
    error: mutation.error as Error | null, // mutation.error is unknown by default.
  };
};

export const useResetPassword = (): {
  resetPassword: (payload: ResetPasswordPayload) => void;
  isPending: boolean;
  isSuccess: boolean;
  isError: boolean;
} => {
  const mutation = useMutation({
    mutationFn: (payload: ResetPasswordPayload) => resetPassword(payload),
  });

  return {
    resetPassword: mutation.mutate,
    isPending: mutation.isPending,
    isSuccess: mutation.isSuccess,
    isError: mutation.isError,
  };
};

export const useChangePassword = (): {
  changePassword: (payload: ChangePasswordPayload) => void;
  isPending: boolean;
  isSuccess: boolean;
  isError: boolean;
} => {
  const mutation = useMutation({
    mutationFn: (payload: ChangePasswordPayload) => changePassword(payload),
  });

  return {
    changePassword: mutation.mutate,
    isPending: mutation.isPending,
    isSuccess: mutation.isSuccess,
    isError: mutation.isError,
  };
};

export const useUpdateProfile = (): {
  updateProfile: (payload: UpdateProfilePayload) => void;
  isPending: boolean;
  isError: boolean;
  data: Awaited<ReturnType<typeof updateProfile>> | undefined;
} => {
  const queryClient = getBrowserQueryClient();
  const mutation = useMutation({
    mutationFn: (payload: UpdateProfilePayload) => updateProfile(payload),
    onSuccess: (updatedUser) => {
      queryClient.setQueryData(authKeys.me(), updatedUser);
    },
  });

  return {
    updateProfile: mutation.mutate,
    isPending: mutation.isPending,
    isError: mutation.isError,
    data: mutation.data,
  };
};

export const useVerifyEmail = (): {
  verifyEmail: (token: string) => void;
  isPending: boolean;
  isSuccess: boolean;
  isError: boolean;
} => {
  const queryClient = getBrowserQueryClient();
  const mutation = useMutation({
    mutationFn: (token: string) => verifyEmail(token),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: authKeys.me() });
    },
  });

  return {
    verifyEmail: mutation.mutate,
    isPending: mutation.isPending,
    isSuccess: mutation.isSuccess,
    isError: mutation.isError,
  };
};

export const useSetupMFA = (): {
  setupMFA: () => void;
  isPending: boolean;
  data: Awaited<ReturnType<typeof setupMFA>> | undefined;
  isError: boolean;
} => {
  const mutation = useMutation({ mutationFn: setupMFA });

  return {
    setupMFA: mutation.mutate,
    isPending: mutation.isPending,
    data: mutation.data,
    isError: mutation.isError,
  };
};

export const useVerifyMFA = (): {
  verifyMFA: (payload: MFAVerifyPayload) => void;
  isPending: boolean;
  isSuccess: boolean;
  isError: boolean;
  data: Awaited<ReturnType<typeof verifyMFA>> | undefined;
} => {
  const queryClient = getBrowserQueryClient();
  const mutation = useMutation({
    mutationFn: (payload: MFAVerifyPayload) => verifyMFA(payload),
    onSuccess: (response) => {
      queryClient.setQueryData(authKeys.me(), {
        ...response.user,
        mfaEnabled: true,
      });
    },
  });

  return {
    verifyMFA: mutation.mutate,
    isPending: mutation.isPending,
    isSuccess: mutation.isSuccess,
    isError: mutation.isError,
    data: mutation.data,
  };
};

export const useDisableMFA = (): {
  disableMFA: (code: string) => void;
  isPending: boolean;
  isSuccess: boolean;
  isError: boolean;
} => {
  const queryClient = getBrowserQueryClient();
  const mutation = useMutation({
    mutationFn: (code: string) => disableMFA(code),
    onSuccess: () => {
      const user = queryClient.getQueryData<Awaited<ReturnType<typeof getMe>>>(
        authKeys.me(),
      );
      if (user) {
        queryClient.setQueryData(authKeys.me(), { ...user, mfaEnabled: false });
      }
    },
  });

  return {
    disableMFA: mutation.mutate,
    isPending: mutation.isPending,
    isSuccess: mutation.isSuccess,
    isError: mutation.isError,
  };
};

export const useRevokeSession = (): {
  revokeSession: (sessionId: string) => void;
  isPending: boolean;
  isError: boolean;
} => {
  const queryClient = getBrowserQueryClient();
  const mutation = useMutation({
    mutationFn: (sessionId: string) => revokeSession(sessionId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: authKeys.sessions() });
    },
  });

  return {
    revokeSession: mutation.mutate,
    isPending: mutation.isPending,
    isError: mutation.isError,
  };
};

export const useRevokeAllOtherSessions = (): {
  revokeAllOtherSessions: () => void;
  isPending: boolean;
  isSuccess: boolean;
} => {
  const queryClient = getBrowserQueryClient();
  const mutation = useMutation({
    mutationFn: revokeAllOtherSessions,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: authKeys.sessions() });
    },
  });

  return {
    revokeAllOtherSessions: mutation.mutate,
    isPending: mutation.isPending,
    isSuccess: mutation.isSuccess,
  };
};
