import { users, type User, type InsertUser, pets, type Pet, type InsertPet, subscriptions, type Subscription, type InsertSubscription } from "@shared/schema";
import session from "express-session";
import createMemoryStore from "memorystore";

// Create a type for the session store
type SessionStore = ReturnType<typeof createMemoryStore>;
const MemoryStore = createMemoryStore(session);

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Pet operations
  getPet(id: number): Promise<Pet | undefined>;
  getPetsByUserId(userId: number): Promise<Pet[]>;
  createPet(pet: InsertPet): Promise<Pet>;
  updatePet(id: number, pet: Partial<InsertPet>): Promise<Pet | undefined>;
  
  // Subscription operations
  getSubscription(id: number): Promise<Subscription | undefined>;
  getSubscriptionsByUserId(userId: number): Promise<Subscription[]>;
  createSubscription(subscription: InsertSubscription): Promise<Subscription>;
  updateSubscription(id: number, subscription: Partial<InsertSubscription>): Promise<Subscription | undefined>;
  
  // Session store
  sessionStore: any; // Using any to avoid the typing issues for now
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private pets: Map<number, Pet>;
  private subscriptions: Map<number, Subscription>;
  private userIdCounter: number;
  private petIdCounter: number;
  private subscriptionIdCounter: number;
  sessionStore: any; // Using any to avoid the typing issues for now

  constructor() {
    this.users = new Map();
    this.pets = new Map();
    this.subscriptions = new Map();
    this.userIdCounter = 1;
    this.petIdCounter = 1;
    this.subscriptionIdCounter = 1;
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000, // 24 hours
    });
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.email === email,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userIdCounter++;
    const user: User = { 
      ...insertUser, 
      id, 
      fullName: insertUser.fullName || null,
      isAdmin: false, // default value, can be set to true later for admin users
      createdAt: new Date() 
    };
    this.users.set(id, user);
    return user;
  }

  // Pet operations
  async getPet(id: number): Promise<Pet | undefined> {
    return this.pets.get(id);
  }

  async getPetsByUserId(userId: number): Promise<Pet[]> {
    return Array.from(this.pets.values()).filter(
      (pet) => pet.userId === userId,
    );
  }

  async createPet(insertPet: InsertPet): Promise<Pet> {
    const id = this.petIdCounter++;
    const pet: Pet = { 
      ...insertPet, 
      id, 
      createdAt: new Date(),
      dietaryPreferences: insertPet.dietaryPreferences || {} 
    };
    this.pets.set(id, pet);
    return pet;
  }

  async updatePet(id: number, petData: Partial<InsertPet>): Promise<Pet | undefined> {
    const pet = this.pets.get(id);
    if (!pet) return undefined;
    
    const updatedPet: Pet = {
      ...pet,
      ...petData,
    };
    
    this.pets.set(id, updatedPet);
    return updatedPet;
  }

  // Subscription operations
  async getSubscription(id: number): Promise<Subscription | undefined> {
    return this.subscriptions.get(id);
  }

  async getSubscriptionsByUserId(userId: number): Promise<Subscription[]> {
    return Array.from(this.subscriptions.values()).filter(
      (subscription) => subscription.userId === userId,
    );
  }

  async createSubscription(insertSubscription: InsertSubscription): Promise<Subscription> {
    const id = this.subscriptionIdCounter++;
    const subscription: Subscription = { 
      ...insertSubscription, 
      id, 
      createdAt: new Date(),
      updatedAt: new Date(),
      addons: insertSubscription.addons || []
    };
    this.subscriptions.set(id, subscription);
    return subscription;
  }

  async updateSubscription(id: number, subscriptionData: Partial<InsertSubscription>): Promise<Subscription | undefined> {
    const subscription = this.subscriptions.get(id);
    if (!subscription) return undefined;
    
    const updatedSubscription: Subscription = {
      ...subscription,
      ...subscriptionData,
      updatedAt: new Date()
    };
    
    this.subscriptions.set(id, updatedSubscription);
    return updatedSubscription;
  }
}

export const storage = new MemStorage();
