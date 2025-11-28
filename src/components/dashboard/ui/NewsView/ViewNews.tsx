"use client";
import React, { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { NewsArticle, CreateNewsDto, NEWS_CATEGORIES, NotificationType, NewsSchema } from "./types";
import { fetchArticles, updateArticle, deleteArticle } from "./api";
import { Notification } from "./Notification";
import { StatsCard } from "./StatsCard";
import { Filters } from "./Filters";
import { ArticleTable } from "./ArticleTable";
import { ViewArticleModal } from "./ViewArticleModal";
import { EditArticleModal } from "./EditArticleModal";
import { DeleteModal } from "./DeleteModal";

interface User {
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  profileImage?: string;
}

const ViewNews: React.FC = () => {
  const router = useRouter();
  
  // State Management
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [filteredArticles, setFilteredArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"publishedAt" | "title" | "category">("publishedAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  
  // Modal States
  const [selectedArticle, setSelectedArticle] = useState<NewsArticle | null>(null);
  const [editingArticle, setEditingArticle] = useState<NewsArticle | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteArticleId, setDeleteArticleId] = useState<number | null>(null);
  
  // Form and Notification States
  const [editFormData, setEditFormData] = useState<CreateNewsDto | null>(null);
  const [editErrors, setEditErrors] = useState<Record<string, string>>({});
  const [notification, setNotification] = useState<NotificationType>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [user, setUser] = useState<User | null>(null);

  // Authentication Check
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    setIsAuthenticated(!!token);
    
    if (!token) {
      setNotification({
        message: 'You need to login to view admin panel',
        type: 'error'
      });
      setTimeout(() => router.push('/login'), 2000);
      return;
    }
    
    fetchArticlesHandler();
  }, [router]);

  // Fetch Articles
const fetchArticlesHandler = useCallback(async () => {
  try {
    const data = await fetchArticles();
    setArticles(data);
    setFilteredArticles(data); // Initialize filtered articles with all articles
  } catch (error) {
    console.error("Error fetching articles:", error);
    setNotification({
      message: "Failed to fetch articles",
      type: "error"
    });
    setArticles([]);
    setFilteredArticles([]);
  } finally {
    setLoading(false);
  }
}, []);

  // Filter and Search Logic
  useEffect(() => {
    let filtered = [...articles];

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(article =>
        article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (article.excerpt && article.excerpt.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Apply category filter
    if (categoryFilter !== "all") {
      filtered = filtered.filter(article => article.category === categoryFilter);
    }

    // Apply status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter(article => 
        statusFilter === "published" ? article.isPublished : !article.isPublished
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue: string | number;
      let bValue: string | number;

      switch (sortBy) {
        case "title":
          aValue = a.title.toLowerCase();
          bValue = b.title.toLowerCase();
          break;
        case "category":
          aValue = a.category;
          bValue = b.category;
          break;
        default:
          aValue = new Date(a.publishedAt).getTime();
          bValue = new Date(b.publishedAt).getTime();
      }

      if (sortOrder === "asc") {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    setFilteredArticles(filtered);
    setCurrentPage(1);
  }, [articles, searchTerm, categoryFilter, statusFilter, sortBy, sortOrder]);

  // Pagination
  const totalPages = Math.ceil(filteredArticles.length / itemsPerPage);
  const paginatedArticles = filteredArticles.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // CRUD Operations
  const handleEdit = (article: NewsArticle) => {
    setEditingArticle(article);
    setEditFormData({
      title: article.title,
      content: article.content,
      excerpt: article.excerpt || "",
      imageUrl: article.imageUrl || "",
      category: article.category,
      isPublished: article.isPublished,
      publishedAt: new Date(article.publishedAt).toISOString().slice(0, 16),
      authorId: article.authorId,
      author: article.author,
    });
    setEditErrors({});
  };

  const handleUpdateArticle = async () => {
    if (!editingArticle || !editFormData) return;

    try {
      NewsSchema.omit({ id: true, createdAt: true, updatedAt: true }).parse(editFormData);
      setEditErrors({});
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        error.issues.forEach((err) => {
          if (err.path.length > 0) {
            const key = String(err.path[0]);
            newErrors[key] = err.message;
          }
        });
        setEditErrors(newErrors);
        return;
      }
    }

    try {
      await updateArticle(editingArticle.id, {
        ...editFormData,
        publishedAt: new Date(editFormData.publishedAt).toISOString()
      });

      setNotification({
        message: "Article updated successfully!",
        type: "success"
      });
      
      setEditingArticle(null);
      setEditFormData(null);
      fetchArticlesHandler();
    } catch (error) {
      setNotification({
        message: "Failed to update article",
        type: "error"
      });
    }
  };

const handleDelete = async (id: string) => {
  try {
    await deleteArticle(id);
    setNotification({
      message: "Article deleted successfully!",
      type: "success"
    });
    setShowDeleteModal(false);
    setDeleteArticleId(null);
    fetchArticlesHandler();
  } catch (error) {
    setNotification({
      message: "Failed to delete article",
      type: "error"
    });
  }
};

  const togglePublishStatus = async (article: NewsArticle) => {
    try {
      await updateArticle(article.id, {
        ...article,
        isPublished: !article.isPublished,
        publishedAt: article.publishedAt
      });

      setNotification({
        message: `Article ${!article.isPublished ? 'published' : 'unpublished'} successfully!`,
        type: "success"
      });
      
      fetchArticlesHandler();
    } catch (error) {
      setNotification({
        message: "Failed to update status",
        type: "error"
      });
    }
  };

  const handleEditFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    if (!editFormData) return;
    
    const { name, value, type } = e.target;
    const newValue = type === "checkbox" ? (e.target as HTMLInputElement).checked : value;
    
    setEditFormData(prev => prev ? { ...prev, [name]: newValue } : null);
    
    if (editErrors[name]) {
      setEditErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  // Auto-hide notifications
  useEffect(() => {
        const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(Array.isArray(parsedUser) ? parsedUser[0] : parsedUser);
      } catch (e) {
        console.error("Failed to parse user data", e);
      }
    }
    if (notification) {
      const timer = setTimeout(() => {
        setNotification(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-sm">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600 mx-auto mb-4"></div>
            <p className="text-lg text-gray-600">Redirecting to login...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="sm:flex sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">News Management</h1>
              <p className="mt-2 text-gray-600">Manage all news articles from your dashboard</p>
            </div>
            <div className="mt-4 sm:mt-0">
              <button
                onClick={() => router.push('/dashboard/news/create-news')}
                className={`bg-emerald-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 transition-colors ${user?.role === 'STUDENT' ? 'hidden' : 'flex'}`}
              >
                + Add New Article
              </button>
            </div>
          </div>
        </div>

        {/* Notification */}
        <Notification notification={notification} />

        {/* Filters and Search */}
        <Filters
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          categoryFilter={categoryFilter}
          setCategoryFilter={setCategoryFilter}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          sortBy={sortBy}
          setSortBy={setSortBy}
          sortOrder={sortOrder}
          setSortOrder={setSortOrder}
        />

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <StatsCard
            icon={
              <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            }
            value={articles.length}
            label="Total Articles"
            color="blue"
          />
          <StatsCard
            icon={
              <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
              </svg>
            }
            value={articles.filter(a => a.isPublished).length}
            label="Published"
            color="green"
          />
          <StatsCard
            icon={
              <svg className="w-5 h-5 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd"></path>
              </svg>
            }
            value={articles.filter(a => !a.isPublished).length}
            label="Drafts"
            color="yellow"
          />
          <StatsCard
            icon={
              <svg className="w-5 h-5 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd"></path>
              </svg>
            }
            value={filteredArticles.length}
            label="Filtered Results"
            color="purple"
          />
        </div>

        {/* Articles Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <ArticleTable
            articles={paginatedArticles}
            loading={loading}
            searchTerm={searchTerm}
            categoryFilter={categoryFilter}
            statusFilter={statusFilter}
            currentPage={currentPage}
            itemsPerPage={itemsPerPage}
            totalPages={totalPages}
            setCurrentPage={setCurrentPage}
            setSelectedArticle={setSelectedArticle}
            handleEdit={handleEdit}
            togglePublishStatus={togglePublishStatus}
            setDeleteArticleId={setDeleteArticleId}
            setShowDeleteModal={setShowDeleteModal}
            router={router}
          />
        </div>

        {/* View Article Modal */}
        {selectedArticle && (
          <ViewArticleModal
            article={selectedArticle}
            onClose={() => setSelectedArticle(null)}
          />
        )}

        {/* Edit Article Modal */}
        {editingArticle && editFormData && (
          <EditArticleModal
            article={editingArticle}
            editFormData={editFormData}
            editErrors={editErrors}
            onClose={() => {
              setEditingArticle(null);
              setEditFormData(null);
              setEditErrors({});
            }}
            onSubmit={handleUpdateArticle}
            onChange={handleEditFormChange}
          />
        )}

        {/* Delete Confirmation Modal */}
        <DeleteModal
          show={showDeleteModal && deleteArticleId !== null}
          onCancel={() => {
            setShowDeleteModal(false);
            setDeleteArticleId(null);
          }}
          onConfirm={() => deleteArticleId !== null && handleDelete(String(deleteArticleId))}
        />
      </div>
    </div>
  );
};

export default ViewNews;