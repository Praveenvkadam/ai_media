// convex/dashboard.js
import { query } from "./_generated/server";
import { v } from "convex/values";

export const getDashboardStats = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    // Get current user
    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) => q.eq("tokenIdentifier", identity.tokenIdentifier))
      .first();

    if (!user) {
      throw new Error("User not found");
    }

    // Get user's posts
    const posts = await ctx.db
      .query("posts")
      .withIndex("by_author", (q) => q.eq("authorId", user._id))
      .collect();

    // Get all time stats
    const totalViews = posts.reduce((sum, post) => sum + (post.viewCount || 0), 0);
    const totalLikes = posts.reduce((sum, post) => sum + (post.likeCount || 0), 0);

    // Get comments count
    const comments = await ctx.db
      .query("comments")
      .withIndex("by_author", (q) => q.eq("authorId", user._id))
      .collect();
    const totalComments = comments.length;

    // Get followers count
    const followers = await ctx.db
      .query("follows")
      .withIndex("by_following", (q) => q.eq("followingId", user._id))
      .collect();

    // Calculate changes from last 30 days
    const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;
    const last30DaysPosts = posts.filter(post => post.publishedAt >= thirtyDaysAgo);
    const prev30DaysPosts = posts.filter(post => 
      post.publishedAt < thirtyDaysAgo && post.publishedAt >= (thirtyDaysAgo - (30 * 24 * 60 * 60 * 1000))
    );

    const calculateChange = (current, previous) => {
      if (previous === 0) return current > 0 ? 100 : 0;
      return ((current - previous) / previous * 100).toFixed(1);
    };

    const currentViews = last30DaysPosts.reduce((sum, post) => sum + (post.viewCount || 0), 0);
    const previousViews = prev30DaysPosts.reduce((sum, post) => sum + (post.viewCount || 0), 0);
    const viewsChange = calculateChange(currentViews, previousViews);

    const currentLikes = last30DaysPosts.reduce((sum, post) => sum + (post.likeCount || 0), 0);
    const previousLikes = prev30DaysPosts.reduce((sum, post) => sum + (post.likeCount || 0), 0);
    const likesChange = calculateChange(currentLikes, previousLikes);

    const currentComments = comments.filter(c => c.createdAt >= thirtyDaysAgo).length;
    const previousComments = comments.filter(c => 
      c.createdAt < thirtyDaysAgo && c.createdAt >= (thirtyDaysAgo - (30 * 24 * 60 * 60 * 1000))
    ).length;
    const commentsChange = calculateChange(currentComments, previousComments);

    // Get followers change
    const currentFollowers = followers.filter(f => f.createdAt >= thirtyDaysAgo).length;
    const previousFollowers = followers.filter(f => 
      f.createdAt < thirtyDaysAgo && f.createdAt >= (thirtyDaysAgo - (30 * 24 * 60 * 60 * 1000))
    ).length;
    const followersChange = calculateChange(currentFollowers, previousFollowers);

    return {
      views: {
        total: totalViews,
        change: parseFloat(viewsChange),
        trend: viewsChange >= 0 ? 'up' : 'down'
      },
      likes: {
        total: totalLikes,
        change: parseFloat(likesChange),
        trend: likesChange >= 0 ? 'up' : 'down'
      },
      comments: {
        total: totalComments,
        change: parseFloat(commentsChange),
        trend: commentsChange >= 0 ? 'up' : 'down'
      },
      followers: {
        total: followers.length,
        change: parseFloat(followersChange),
        trend: followersChange >= 0 ? 'up' : 'down'
      }
    };
  }
});