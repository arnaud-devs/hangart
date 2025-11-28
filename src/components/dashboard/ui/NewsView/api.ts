import { NewsArticle } from "./types";

const API_ENDPOINT = process.env.NEXT_PUBLIC_API_ENDPOINT || "https://niceschool-be-2.onrender.com/api/news";

export const fetchArticles = async (): Promise<NewsArticle[]> => {
  const token = localStorage.getItem("authToken");
  const response = await fetch(API_ENDPOINT, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch articles');
  }

  const responseData = await response.json();
  // Extract articles from the data property of the response
  return Array.isArray(responseData.data) ? responseData.data : [];
};

export const updateArticle = async (id: string, articleData: Partial<NewsArticle>) => {
  const token = localStorage.getItem("authToken");
  const response = await fetch(`${API_ENDPOINT}/${id}`, {
    method: "PATCH",
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(articleData),
  });

  if (!response.ok) {
    throw new Error('Failed to update article');
  }

  const responseData = await response.json();
  return responseData.data; // Return the updated article
};

export const deleteArticle = async (id: string) => {
  const token = localStorage.getItem("authToken");
  const response = await fetch(`${API_ENDPOINT}/${id}`, {
    method: "DELETE",
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to delete article');
  }

  return response.json();
};