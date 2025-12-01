import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // ============================
  // USERS TABLE
  // ============================
  users: defineTable({
    name: v.string(),
    email: v.string(),
    tokenIdentifier: v.string(),
    imageUrl: v.optional(v.string()),
    username: v.optional(v.string()),
    Phone: v.optional(v.bigint()),
    createdAt: v.number(),
    lastActiveAt: v.number(),
  })
    .index("by_token", ["tokenIdentifier"])
    .index("by_email", ["email"])
    .index("by_username", ["username"])
    .searchIndex("search_name", { searchField: "name" })
    .searchIndex("search_email", { searchField: "email" }),

  // ============================
  // POSTS TABLE
  // ============================
  posts: defineTable({
    title: v.string(),
    content: v.string(),
    status: v.union(v.literal("draft"), v.literal("published")),
    authorId: v.id("users"),
    tag: v.array(v.string()),
    category: v.optional(v.string()),
    featuredImage: v.optional(v.string()),
    viewCount: v.number(),
    likeCount: v.number(),
    publishedAt: v.optional(v.number()),
  })
    .index("by_author", ["authorId"])
    .index("by_status", ["status"])
    .index("by_published", ["publishedAt"])
    .index("by_author_status", ["authorId", "status"])
    .searchIndex("search_content", { searchField: "content" }),

  // ============================
  // COMMENTS TABLE
  // ============================
  comments: defineTable({
    postId: v.id("posts"),
    authorId: v.optional(v.id("users")),
    authorName: v.string(),
    authorEmail: v.optional(v.string()),
    content: v.string(),
    status: v.union(
      v.literal("approved"),
      v.literal("pending"),
      v.literal("rejected"),
    ),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_post", ["postId"])
    .index("by_post_status", ["postId", "status"])
    .index("by_author", ["authorId"]),

  // ============================
  // LIKES TABLE
  // ============================
  likes: defineTable({
    postId: v.id("posts"),
    userId: v.optional(v.id("users")),
    createdAt: v.number(),
  })
    .index("by_post", ["postId"])
    .index("by_user", ["userId"])
    .index("by_post_user", ["postId", "userId"]),

  // ============================
  // FOLLOWS TABLE
  // ============================
  follows: defineTable({
    followerId: v.id("users"),
    followingId: v.id("users"),
    createdAt: v.number(),
  })
    .index("by_follower", ["followerId"])
    .index("by_following", ["followingId"])
    .index("by_follower_following", ["followerId", "followingId"]),

  // ============================
  // DAILY STATS TABLE
  // ============================
  dailystats: defineTable({
    postId: v.id("posts"),
    date: v.string(),
    views: v.number(),
    likes: v.number(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_post", ["postId"])
    .index("by_date", ["date"])
    .index("by_post_date", ["postId", "date"]),
});
