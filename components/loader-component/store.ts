import { create } from 'zustand';

interface LenisInstance {
  scrollTo: (target: number, options?: { force?: boolean }) => void;
  start: () => void;
  stop: () => void;
}

interface LoaderStore {
  lenis: LenisInstance | undefined;
  setLenis: (lenis: LenisInstance) => void;
  introOut: boolean;
  setIntroOut: (introOut: boolean) => void;
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
  isAbout: boolean;
  setIsAbout: (isAbout: boolean) => void;
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
  toggleTheme: () => void;
}

export const useLoaderStore = create<LoaderStore>((set) => ({
  lenis: undefined,
  setLenis: (lenis) => set({ lenis }),
  introOut: false,
  setIntroOut: (introOut) => set({ introOut }),
  isLoading: true,
  setIsLoading: (isLoading) => set({ isLoading }),
  isAbout: false,
  setIsAbout: (isAbout) => set({ isAbout }),
  theme: 'light',
  setTheme: (theme) => set({ theme }),
  toggleTheme: () =>
    set((state) => {
      const newTheme = state.theme === 'light' ? 'dark' : 'light';
      if (typeof window !== 'undefined') {
        localStorage.setItem('theme', newTheme);
        document.documentElement.setAttribute('data-theme', newTheme);
      }
      return { theme: newTheme };
    }),
}));
