import { Express } from "express";
import { db } from "../db";
import { projects, ideaValidations, businessPlans, resourcePlans, mvpRequirements } from "@db/schema";
import { eq } from "drizzle-orm";

export function registerRoutes(app: Express) {
  // Project routes
  app.post("/api/projects", async (req, res) => {
    try {
      const project = await db.insert(projects).values(req.body).returning();
      res.json(project[0]);
    } catch (error) {
      res.status(500).json({ error: "Failed to create project" });
    }
  });

  app.get("/api/projects", async (req, res) => {
    try {
      const allProjects = await db.select().from(projects);
      res.json(allProjects);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch projects" });
    }
  });

  app.get("/api/projects/:id", async (req, res) => {
    try {
      const project = await db
        .select()
        .from(projects)
        .where(eq(projects.id, parseInt(req.params.id)))
        .limit(1);
      
      if (!project.length) {
        return res.status(404).json({ error: "Project not found" });
      }
      
      res.json(project[0]);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch project" });
    }
  });

  // Stage-specific routes
  app.post("/api/projects/:id/idea-validation", async (req, res) => {
    try {
      const validation = await db
        .insert(ideaValidations)
        .values({ ...req.body, projectId: parseInt(req.params.id) })
        .returning();
      res.json(validation[0]);
    } catch (error) {
      res.status(500).json({ error: "Failed to save idea validation" });
    }
  });

  app.post("/api/projects/:id/analyze-idea", async (req, res) => {
    try {
      const { problemStatement, targetMarket, uniqueValue } = req.body;
      const analysis = await analyzeStartupIdea(
        problemStatement,
        targetMarket,
        uniqueValue
      );
      res.json(analysis);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/projects/:id/business-plan", async (req, res) => {
    try {
      const plan = await db
        .insert(businessPlans)
        .values({ ...req.body, projectId: parseInt(req.params.id) })
        .returning();
      res.json(plan[0]);
    } catch (error) {
      res.status(500).json({ error: "Failed to save business plan" });
    }
  });

  app.post("/api/projects/:id/resource-plan", async (req, res) => {
    try {
      const resources = await db
        .insert(resourcePlans)
        .values({ ...req.body, projectId: parseInt(req.params.id) })
        .returning();
      res.json(resources[0]);
    } catch (error) {
      res.status(500).json({ error: "Failed to save resource plan" });
    }
  });

  app.post("/api/projects/:id/mvp-requirements", async (req, res) => {
    try {
      const mvp = await db
        .insert(mvpRequirements)
        .values({ ...req.body, projectId: parseInt(req.params.id) })
        .returning();
      res.json(mvp[0]);
    } catch (error) {
      res.status(500).json({ error: "Failed to save MVP requirements" });
    }
  });

  return app;
}
