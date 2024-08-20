export const createArticleUrl = (articleId: string) => `/article/${articleId}`;
export const createArticleEditUrl = (articleId: string) =>
  `/article-editor/${articleId}`;

export const createWorkoutUrl = (articleId: string) => `/workout/${articleId}`;
export const createWorkoutEditUrl = (articleId: string) =>
  `/workout-editor/${articleId}`;

export const createUrlBase = (url: string) => `${process.env.HOSTING_URL}${url}`
