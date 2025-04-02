import type { Express } from "express";
import { createServer, type Server } from "http";
import { setupAuth } from "./auth";
import { storage } from "./storage";
import { insertPetSchema, insertSubscriptionSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Setup authentication routes
  setupAuth(app);

  // Pet Profile Routes
  app.post("/api/pets", async (req, res, next) => {
    if (!req.isAuthenticated()) return res.status(401).json({ message: "Unauthorized" });
    
    try {
      const validatedData = insertPetSchema.parse({
        ...req.body,
        userId: req.user.id
      });
      
      const pet = await storage.createPet(validatedData);
      res.status(201).json(pet);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: error.errors });
      }
      next(error);
    }
  });

  app.get("/api/pets", async (req, res, next) => {
    if (!req.isAuthenticated()) return res.status(401).json({ message: "Unauthorized" });
    
    try {
      const pets = await storage.getPetsByUserId(req.user.id);
      res.json(pets);
    } catch (error) {
      next(error);
    }
  });

  app.get("/api/pets/:id", async (req, res, next) => {
    if (!req.isAuthenticated()) return res.status(401).json({ message: "Unauthorized" });
    
    try {
      const petId = parseInt(req.params.id);
      if (isNaN(petId)) {
        return res.status(400).json({ message: "Invalid pet ID" });
      }
      
      const pet = await storage.getPet(petId);
      
      if (!pet) {
        return res.status(404).json({ message: "Pet not found" });
      }
      
      // Verify the pet belongs to the current user
      if (pet.userId !== req.user.id) {
        return res.status(403).json({ message: "Forbidden" });
      }
      
      res.json(pet);
    } catch (error) {
      next(error);
    }
  });

  // Subscription Routes
  app.post("/api/subscriptions", async (req, res, next) => {
    if (!req.isAuthenticated()) return res.status(401).json({ message: "Unauthorized" });
    
    try {
      const validatedData = insertSubscriptionSchema.parse({
        ...req.body,
        userId: req.user.id
      });
      
      // Verify the pet belongs to the current user
      const pet = await storage.getPet(validatedData.petId);
      if (!pet || pet.userId !== req.user.id) {
        return res.status(403).json({ message: "Forbidden" });
      }
      
      const subscription = await storage.createSubscription(validatedData);
      res.status(201).json(subscription);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: error.errors });
      }
      next(error);
    }
  });

  app.get("/api/subscriptions", async (req, res, next) => {
    if (!req.isAuthenticated()) return res.status(401).json({ message: "Unauthorized" });
    
    try {
      const subscriptions = await storage.getSubscriptionsByUserId(req.user.id);
      res.json(subscriptions);
    } catch (error) {
      next(error);
    }
  });

  app.get("/api/subscriptions/:id", async (req, res, next) => {
    if (!req.isAuthenticated()) return res.status(401).json({ message: "Unauthorized" });
    
    try {
      const subscriptionId = parseInt(req.params.id);
      if (isNaN(subscriptionId)) {
        return res.status(400).json({ message: "Invalid subscription ID" });
      }
      
      const subscription = await storage.getSubscription(subscriptionId);
      
      if (!subscription) {
        return res.status(404).json({ message: "Subscription not found" });
      }
      
      // Verify the subscription belongs to the current user
      if (subscription.userId !== req.user.id) {
        return res.status(403).json({ message: "Forbidden" });
      }
      
      res.json(subscription);
    } catch (error) {
      next(error);
    }
  });

  app.post("/api/upload/logo", async (req, res, next) => {
    if (!req.isAuthenticated()) return res.status(401).json({ message: "Unauthorized" });
    
    try {
      const file = req.files?.logo;
      if (!file) {
        return res.status(400).json({ message: "No file uploaded" });
      }
      
      // Store in Object Storage
      const fileName = `logos/${Date.now()}-${file.name}`;
      await storage.client.upload(fileName, file.data);
      
      const fileUrl = await storage.client.getSignedUrl(fileName);
      res.json({ url: fileUrl });
    } catch (error) {
      next(error);
    }
  });

  app.patch("/api/subscriptions/:id", async (req, res, next) => {
    if (!req.isAuthenticated()) return res.status(401).json({ message: "Unauthorized" });
    
    try {
      const subscriptionId = parseInt(req.params.id);
      if (isNaN(subscriptionId)) {
        return res.status(400).json({ message: "Invalid subscription ID" });
      }
      
      const subscription = await storage.getSubscription(subscriptionId);
      
      if (!subscription) {
        return res.status(404).json({ message: "Subscription not found" });
      }
      
      // Verify the subscription belongs to the current user
      if (subscription.userId !== req.user.id) {
        return res.status(403).json({ message: "Forbidden" });
      }
      
      // Update the subscription
      const updatedSubscription = await storage.updateSubscription(subscriptionId, req.body);
      
      res.json(updatedSubscription);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: error.errors });
      }
      next(error);
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
