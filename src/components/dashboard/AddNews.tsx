"use client";
import React, { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";

// Constants and Types
const NEWS_CATEGORIES = [
  "general",
  "entertainment", 
  "politics",
  "sports",
  "technology",
  "health",
  "business",
  "education"
] as const;

const NewsSchema = z.object({
  title: z.string().min(1, "Title is required").max(100),
  content: z.string().min(1, "Content is required"),
  excerpt: z.string().max(200).optional(),
  imageUrl: z.string().url("Invalid URL").optional().or(z.literal("")),
  category: z.enum(NEWS_CATEGORIES).default("general"),
  isPublished: z.boolean().default(true),
  publishedAt: z.string().refine(val => !isNaN(Date.parse(val)), {
    message: "Invalid date format"
  })
});

type CreateNewsDto = z.infer<typeof NewsSchema>;

const API_ENDPOINT = process.env.NEXT_PUBLIC_API_ENDPOINT || "https://niceschool-be-2.onrender.com/api/news";

const AddNews: React.FC = () => {
  const router = useRouter();
  const [formData, setFormData] = useState<CreateNewsDto>({
    title: "",
    content: "",
    excerpt: "",
    imageUrl: "",
    category: "general",
    isPublished: true,
    publishedAt: new Date().toISOString().slice(0, 16),
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [notification, setNotification] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check authentication on mount
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    setIsAuthenticated(!!token);
    
    if (!token) {
      setNotification({
        message: 'You need to login to create news articles',
        type: 'error'
      });
      setTimeout(() => router.push('/login'), 2000);
    }
  }, [router]);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const { name, value, type } = e.target;
      
      setFormData(prev => ({
        ...prev,
        [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value
      }));

      // Clear error when user starts typing
      if (errors[name]) {
        setErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors[name];
          return newErrors;
        });
      }
    },
    [errors]
  );

  const validateForm = useCallback(() => {
    try {
      NewsSchema.parse(formData);
      setErrors({});
      return true;
    } catch (error) {
if (error instanceof z.ZodError) {
  const newErrors: Record<string, string> = {};
  error.issues.forEach((err) => {
    if (err.path.length > 0) {
      const key = String(err.path[0]);  // convert symbol to string here
      newErrors[key] = err.message;
          }
        });
        setErrors(newErrors);
      }
      return false;
    }
  }, [formData]);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    setNotification(null);

    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        throw new Error('Authentication required');
      }

      const response = await fetch(API_ENDPOINT, {
        method: "POST",
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          excerpt: formData.excerpt || undefined,
          imageUrl: formData.imageUrl || undefined,
          publishedAt: new Date(formData.publishedAt).toISOString()
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create news article");
      }

      setNotification({ 
        message: "News article created successfully!", 
        type: "success" 
      });
      
      setTimeout(() => router.push("/news"), 1500);
    } catch (error) {
      console.error("Error creating news:", error);
      
      if (error instanceof Error && error.message === 'Authentication required') {
        router.push('/login');
        return;
      }

      setNotification({ 
        message: error instanceof Error ? error.message : "Failed to create news article", 
        type: "error" 
      });
    } finally {
      setLoading(false);
    }
  }, [formData, router, validateForm]);

  const resetForm = useCallback(() => {
    setFormData({
      title: "",
      content: "",
      excerpt: "",
      imageUrl: "",
      category: "general",
      isPublished: true,
      publishedAt: new Date().toISOString().slice(0, 16),
    });
    setErrors({});
    setNotification(null);
  }, []);

  if (!isAuthenticated) {
    return (
      <div className=" mx-auto p-6 bg-white rounded-lg shadow-sm">
        <div className="text-center py-8">
          <p className="text-lg text-red-600">Redirecting to login page...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full lg:px-15  mx-auto p-6 bg-white rounded-lg shadow-sm">

      {notification && (
        <div className={`mb-6 p-4 rounded-lg ${
          notification.type === 'success' 
            ? 'bg-green-50 text-green-800 border border-green-200' 
            : 'bg-red-50 text-red-800 border border-red-200'
        }`}>
          {notification.message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
            Title *
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none ${
              errors.title ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="Enter news article title"
            aria-invalid={!!errors.title}
            aria-describedby={errors.title ? "title-error" : undefined}
          />
          {errors.title && (
            <p id="title-error" className="mt-2 text-sm text-red-600">
              {errors.title}
            </p>
          )}
        </div>

        {/* Content */}
        <div>
          <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
            Content *
          </label>
          <textarea
            id="content"
            name="content"
            value={formData.content}
            onChange={handleInputChange}
            rows={8}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none ${
              errors.content ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="Write the full content of your news article here..."
            aria-invalid={!!errors.content}
            aria-describedby={errors.content ? "content-error" : undefined}
          />
          {errors.content && (
            <p id="content-error" className="mt-2 text-sm text-red-600">
              {errors.content}
            </p>
          )}
        </div>

        {/* Excerpt */}
        <div>
          <label htmlFor="excerpt" className="block text-sm font-medium text-gray-700 mb-2">
            Excerpt (Optional)
          </label>
          <textarea
            id="excerpt"
            name="excerpt"
            value={formData.excerpt}
            onChange={handleInputChange}
            rows={3}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none ${
              errors.excerpt ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="Brief summary or excerpt (will be auto-generated if left empty)"
            aria-invalid={!!errors.excerpt}
            aria-describedby={errors.excerpt ? "excerpt-error" : undefined}
          />
          {errors.excerpt && (
            <p id="excerpt-error" className="mt-2 text-sm text-red-600">
              {errors.excerpt}
            </p>
          )}
        </div>

        {/* Image URL and Category Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700 mb-2">
              Image URL (Optional)
            </label>
            <input
              type="url"
              id="imageUrl"
              name="imageUrl"
              value={formData.imageUrl}
              onChange={handleInputChange}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none ${
                errors.imageUrl ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="https://example.com/image.jpg"
              aria-invalid={!!errors.imageUrl}
              aria-describedby={errors.imageUrl ? "imageUrl-error" : undefined}
            />
            {errors.imageUrl && (
              <p id="imageUrl-error" className="mt-2 text-sm text-red-600">
                {errors.imageUrl}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
              Category
            </label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
            >
              {NEWS_CATEGORIES.map(cat => (
                <option key={cat} value={cat}>
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Publish Settings Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="publishedAt" className="block text-sm font-medium text-gray-700 mb-2">
              Publish Date & Time
            </label>
            <input
              type="datetime-local"
              id="publishedAt"
              name="publishedAt"
              value={formData.publishedAt}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
            />
          </div>

          <div className="flex items-center pt-6">
            <input
              type="checkbox"
              id="isPublished"
              name="isPublished"
              checked={formData.isPublished}
              onChange={handleInputChange}
              className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
            />
            <label htmlFor="isPublished" className="ml-2 block text-sm text-gray-700">
              Publish immediately
            </label>
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-emerald-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Creating...
              </span>
            ) : (
              'Create News Article'
            )}
          </button>

          <button
            type="button"
            onClick={resetForm}
            disabled={loading}
            className="flex-1 sm:flex-none bg-gray-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50 transition-colors"
          >
            Clear Form
          </button>
        </div>
      </form>

      {/* Preview Section */}
      {formData.title && (
        <section className="mt-8 p-6 bg-gray-50 rounded-lg">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Preview</h2>
          <article className="bg-white p-4 rounded-lg shadow-sm">
            {formData.imageUrl && (
              <img 
                src={formData.imageUrl} 
                alt="Preview" 
                className="w-full h-48 object-cover rounded-lg mb-4"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            )}
            <div className="mb-2">
              <span className="bg-emerald-600 text-white text-xs px-2 py-1 rounded-full">
                {formData.category?.charAt(0).toUpperCase() + formData.category?.slice(1)}
              </span>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">{formData.title}</h3>
            {formData.excerpt && (
              <p className="text-gray-600 mb-2">{formData.excerpt}</p>
            )}
            <p className="text-sm text-gray-500">
              {formData.publishedAt ? new Date(formData.publishedAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              }) : 'No date set'}
              {formData.isPublished ? ' • Published' : ' • Draft'}
            </p>
          </article>
        </section>
      )}
    </div>
  );
};

export default AddNews;