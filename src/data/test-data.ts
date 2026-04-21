import { Post } from "../proxy";

export const testPosts = {
  validPost: {
    userId: 1,
    title: "Test Post Title",
    body: "This is a test post body for automated testing.",
  },
  updatedPost: {
    userId: 1,
    title: "Updated Post Title",
    body: "This is the updated post body.",
  },
  patchData: {
    title: "Patched Title",
  },
};

export const testUsers = {
  existingUserId: 1,
  existingPostId: 1,
  existingCommentId: 1,
};
