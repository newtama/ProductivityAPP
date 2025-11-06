export enum Category {
  TASK = 'TASK',
  MAKE_MONEY = 'MAKE_MONEY',
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

export interface Vision {
  horizon: VisionHorizon;
  text: string;
  imageUrl?: string; // Storing image as data URL
}

export interface ForumPost {
  id: string;
  content: string;
  createdAt: number;
  userName: string;
  userAvatar: string;
}