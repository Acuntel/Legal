import { type LeadStatus } from "@/app/generated/prisma/enums";

export interface SessionUser {
  id: string;
  email: string;
  name?: string;
  image?: string;
  firmId?: string;
  role?: string;
}

export interface LeadWithDetails {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  caseType: string | null;
  status: LeadStatus;
  qualScore: number | null;
  qualSummary: string | null;
  qualFlags: string[];
  source: string | null;
  createdAt: Date;
  conversations: { id: string; messages: { id: string }[] }[];
}

export interface WidgetConfig {
  firmName: string;
  greeting: string;
  primaryColor: string;
  secondaryColor: string;
  logoUrl: string | null;
  serviceOptions: string[];
  collectName: boolean;
  collectEmail: boolean;
  collectPhone: boolean;
  collectService: boolean;
}

export interface QualificationResult {
  score: number;
  status: "QUALIFIED" | "NOT_QUALIFIED" | "PENDING_REVIEW";
  summary: string;
  flags: string[];
  extractedData: Record<string, unknown>;
}
