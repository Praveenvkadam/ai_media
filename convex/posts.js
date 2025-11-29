import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Define the schema for a post
export const create = mutation({
  args: {
    title: v.string(),
    content: v.string(),
    authorId: v.id("users"),
    tags: v.optional(v.array(v.string())),
    imageUrl: v.optional(v.string()),
    isPublished: v.optional(v.boolean())
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    // You can add additional validation here
    if (!args.title || !args.content) {
      throw new Error("Title and content are required");
    }

    // Create the post
    const postId = await ctx.db.insert("posts", {
      title: args.title,
      content: args.content,
      authorId: args.authorId,
      tags: args.tags || [],
      imageUrl: args.imageUrl || null,
      isPublished: args.isPublished !== undefined ? args.isPublished : true,
      views: 0,
      likes: 0,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    return postId;
  },
});

// Get all published posts
export const list = query({
  args: {
    limit: v.optional(v.number()),
    skip: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit || 10;
    const skip = args.skip || 0;

    const posts = await ctx.db
      .query("posts")
      .filter((q) => q.eq(q.field("isPublished"), true))
      .order("desc")
      .take(limit + skip);

    return posts.slice(skip);
  },
});

// Get a single post by ID
export const get = query({
  args: { postId: v.id("posts") },
  handler: async (ctx, args) => {
    const post = await ctx.db.get(args.postId);
    if (!post) {
      throw new Error("Post not found");
    }
    return post;
  },
});

// Update a post
export const update = mutation({
  args: {
    postId: v.id("posts"),
    title: v.optional(v.string()),
    content: v.optional(v.string()),
    tags: v.optional(v.array(v.string())),
    imageUrl: v.optional(v.string()),
    isPublished: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const { postId, ...updates } = args;
    
    // You might want to add authorization here to ensure the user owns the post
    const post = await ctx.db.get(postId);
    if (!post) {
      throw new Error("Post not found");
    }

    await ctx.db.patch(postId, {
      ...updates,
      updatedAt: Date.now(),
    });

    return await ctx.db.get(postId);
  },
});

// Delete a post
export const remove = mutation({
  args: { postId: v.id("posts") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    // You might want to add authorization here
    await ctx.db.delete(args.postId);
    return { success: true };
  },
});
