export interface Unit {
  id: number;
  title: string;
  progress: number;
}

export interface Lesson {
  id: number;
  type:
    | "vocab_listening"
    | "vocab_flashcard"
    | "listening_cloze"
    | "listening_mcq"
    | "reading_mcq"
    | "grammar_formula"
    | "grammar_cloze";
  title: string;
  done?: boolean;
  locked?: boolean;
  status?: "not_started" | "in_progress" | "completed";
  duration?: string;
  unitId?: number;
}

export type LessonType = Lesson["type"];

export interface SidebarContextType {
  collapsed: boolean;
  toggle: () => void;
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
}
