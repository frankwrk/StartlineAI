import { pgTable, text, serial, integer, timestamp, boolean, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

export const projects = pgTable("projects", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  stage: text("stage").notNull().default("idea_validation"),
  progress: integer("progress").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const ideaValidations = pgTable("idea_validations", {
  id: serial("id").primaryKey(),
  projectId: integer("project_id").references(() => projects.id),
  problemStatement: text("problem_statement"),
  targetMarket: text("target_market"),
  uniqueValue: text("unique_value"),
  validationStatus: text("validation_status").default("pending"),
  aiSuggestions: jsonb("ai_suggestions"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const businessPlans = pgTable("business_plans", {
  id: serial("id").primaryKey(),
  projectId: integer("project_id").references(() => projects.id),
  executiveSummary: text("executive_summary"),
  marketAnalysis: text("market_analysis"),
  financialProjections: jsonb("financial_projections"),
  strategy: text("strategy"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const resourcePlans = pgTable("resource_plans", {
  id: serial("id").primaryKey(),
  projectId: integer("project_id").references(() => projects.id),
  budget: integer("budget"),
  timeline: jsonb("timeline"),
  teamRequirements: jsonb("team_requirements"),
  tooling: jsonb("tooling"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const mvpRequirements = pgTable("mvp_requirements", {
  id: serial("id").primaryKey(),
  projectId: integer("project_id").references(() => projects.id),
  features: jsonb("features"),
  userStories: jsonb("user_stories"),
  technicalStack: jsonb("technical_stack"),
  deploymentPlan: text("deployment_plan"),
  createdAt: timestamp("created_at").defaultNow(),
});

export type Project = typeof projects.$inferSelect;
export type NewProject = typeof projects.$inferInsert;

export const insertProjectSchema = createInsertSchema(projects);
export const selectProjectSchema = createSelectSchema(projects);
