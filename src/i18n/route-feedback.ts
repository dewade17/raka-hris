import {
  defaultLocale,
  getSupportedLocale,
  type SupportedLocale,
} from "./config";

type RouteFeedbackCopy = {
  loading: {
    label: string;
  };
  error: {
    eyebrow: string;
    title: string;
    description: string;
    retry: string;
  };
  globalError: {
    eyebrow: string;
    title: string;
    description: string;
    retry: string;
  };
  notFound: {
    eyebrow: string;
    title: string;
    description: string;
    home: string;
  };
  unauthorized: {
    eyebrow: string;
    title: string;
    description: string;
    login: string;
    home: string;
  };
};

const routeFeedbackCopyByLocale: Record<SupportedLocale, RouteFeedbackCopy> = {
  en: {
    loading: {
      label: "Loading workspace",
    },
    error: {
      eyebrow: "Application error",
      title: "This section could not be loaded",
      description:
        "Something failed while rendering this page. Try again, and contact the system administrator if the problem continues.",
      retry: "Try again",
    },
    globalError: {
      eyebrow: "Critical error",
      title: "The application could not be loaded",
      description:
        "A critical error stopped the page from rendering. Try again, and contact the system administrator if the problem continues.",
      retry: "Try again",
    },
    notFound: {
      eyebrow: "404",
      title: "Page not found",
      description:
        "The page may have moved, been removed, or you may not have access to it.",
      home: "Back to dashboard",
    },
    unauthorized: {
      eyebrow: "401",
      title: "Sign in required",
      description:
        "Your session is missing or no longer valid. Sign in again to continue.",
      login: "Go to sign in",
      home: "Back to dashboard",
    },
  },
  id: {
    loading: {
      label: "Memuat ruang kerja",
    },
    error: {
      eyebrow: "Gangguan aplikasi",
      title: "Bagian ini belum dapat dimuat",
      description:
        "Terjadi kendala saat menampilkan halaman ini. Coba lagi, lalu hubungi administrator sistem jika masalah masih berlanjut.",
      retry: "Coba lagi",
    },
    globalError: {
      eyebrow: "Gangguan kritis",
      title: "Aplikasi belum dapat dimuat",
      description:
        "Terjadi gangguan kritis sehingga halaman berhenti ditampilkan. Coba lagi, lalu hubungi administrator sistem jika masalah masih berlanjut.",
      retry: "Coba lagi",
    },
    notFound: {
      eyebrow: "404",
      title: "Halaman tidak ditemukan",
      description:
        "Halaman mungkin sudah dipindahkan, dihapus, atau Anda belum memiliki akses.",
      home: "Kembali ke dasbor",
    },
    unauthorized: {
      eyebrow: "401",
      title: "Perlu masuk ulang",
      description:
        "Sesi Anda tidak tersedia atau sudah tidak valid. Masuk kembali untuk melanjutkan.",
      login: "Masuk ulang",
      home: "Kembali ke dasbor",
    },
  },
};

export function getRouteFeedbackCopy(
  locale?: string | string[] | null,
): RouteFeedbackCopy {
  return routeFeedbackCopyByLocale[getSupportedLocale(locale ?? defaultLocale)];
}
