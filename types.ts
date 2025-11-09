export enum Category {
  TASK = 'TASK',
  MAKE_MONEY = 'MAKE_MONMONEY',
  INCREASE_RATE = 'INCREASE_RATE',
  GIVE_ENERGY = 'GIVE_ENERGY',
  IGNORED = 'IGNORED',
}

export interface SubTask {
  id: string;
  text: string;
  completed: boolean;
}

export interface ActionPlanItem {
  id: string;
  text: string;
  completed: boolean;
}

export interface ActionPlan {
  framework?: string;
  keyActions: ActionPlanItem[];
}

export interface TaskItem {
  id:string;
  text: string;
  category: Category;
  rating: number; // 0-5 stars
  delegated: boolean;
  automated: boolean;
  completed: boolean;
  batched: boolean;
  isRoutine: boolean;
  createdAt: number;
  subTasks: SubTask[];
  actionPlan?: ActionPlan;
  completionHistory?: string[]; // Array of 'YYYY-MM-DD' dates
}

export interface SurveyAnswers {
  satisfaction?: string;
  focusFactor?: string;
  improvement?: string;
  timeWasted?: string;
  trigger?: string;
  strategy?: string;
}

export interface ReflectionData {
  survey: SurveyAnswers;
  notes: string;
}

export type VisionHorizon = '5y' | '1y' | '3m' | '1m';

export interface VisionChecklistItem {
  id: string;
  text: string;
  completed: boolean;
}

export interface Vision {
  horizon: VisionHorizon;
  text: string;
  imageUrl?: string; // Storing image as data URL
  checklist?: VisionChecklistItem[];
}

export interface Comment {
  id: string;
  text: string;
  userName:string;
  userAvatar: string;
  createdAt: number;
}

export interface ForumPost {
  id: string;
  content: string;
  createdAt: number;
  userName: string;
  userAvatar: string;
  likes: number;
  likedBy: string[];
  comments: Comment[];
}

export type UserRole = 'user' | 'admin';

export interface Course {
  id: string;
  titleKey: string;
  descKey: string;
  imageUrl: string;
  status: 'active' | 'coming_soon';
}

export interface Session {
  title: string;
  time: string;
  link: string;
}
