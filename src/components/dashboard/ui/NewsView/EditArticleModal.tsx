import { useState } from "react";
import { z } from "zod";
import { NEWS_CATEGORIES, NewsSchema } from "./types";

interface EditArticleModalProps {
  article: any;
  editFormData: any;
  editErrors: Record<string, string>;
  onClose: () => void;
  onSubmit: () => void;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
}

export const EditArticleModal: React.FC<EditArticleModalProps> = ({
  article,
  editFormData,
  editErrors,
  onClose,
  onSubmit,
  onChange,
}) => {
  return (
    <div className="fixed inset-0 bg-gray-600/70 bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Edit Article</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-100"
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form onSubmit={(e) => { e.preventDefault(); onSubmit(); }} className="space-y-6">
            {/* Title */}
            <div>
              <label htmlFor="edit-title" className="block text-sm font-medium text-gray-700 mb-2">
                Title *
              </label>
              <input
                type="text"
                id="edit-title"
                name="title"
                value={editFormData.title}
                onChange={onChange}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none ${
                  editErrors.title ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Enter article title"
              />
              {editErrors.title && (
                <p className="mt-2 text-sm text-red-600">{editErrors.title}</p>
              )}
            </div>

            {/* Content */}
            <div>
              <label htmlFor="edit-content" className="block text-sm font-medium text-gray-700 mb-2">
                Content *
              </label>
              <textarea
                id="edit-content"
                name="content"
                value={editFormData.content}
                onChange={onChange}
                rows={12}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none ${
                  editErrors.content ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Write the full content..."
              />
              {editErrors.content && (
                <p className="mt-2 text-sm text-red-600">{editErrors.content}</p>
              )}
            </div>

            {/* Excerpt */}
            <div>
              <label htmlFor="edit-excerpt" className="block text-sm font-medium text-gray-700 mb-2">
                Excerpt (Optional)
              </label>
              <textarea
                id="edit-excerpt"
                name="excerpt"
                value={editFormData.excerpt}
                onChange={onChange}
                rows={3}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none ${
                  editErrors.excerpt ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Brief summary or excerpt..."
              />
              {editErrors.excerpt && (
                <p className="mt-2 text-sm text-red-600">{editErrors.excerpt}</p>
              )}
            </div>

            {/* Image URL and Category */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="edit-imageUrl" className="block text-sm font-medium text-gray-700 mb-2">
                  Image URL (Optional)
                </label>
                <input
                  type="url"
                  id="edit-imageUrl"
                  name="imageUrl"
                  value={editFormData.imageUrl}
                  onChange={onChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none ${
                    editErrors.imageUrl ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="https://example.com/image.jpg"
                />
                {editErrors.imageUrl && (
                  <p className="mt-2 text-sm text-red-600">{editErrors.imageUrl}</p>
                )}
              </div>

              <div>
                <label htmlFor="edit-category" className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select
                  id="edit-category"
                  name="category"
                  value={editFormData.category}
                  onChange={onChange}
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

            {/* Publish Settings */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="edit-publishedAt" className="block text-sm font-medium text-gray-700 mb-2">
                  Publish Date & Time
                </label>
                <input
                  type="datetime-local"
                  id="edit-publishedAt"
                  name="publishedAt"
                  value={editFormData.publishedAt}
                  onChange={onChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                />
              </div>

              <div className="flex items-center pt-6">
                <input
                  type="checkbox"
                  id="edit-isPublished"
                  name="isPublished"
                  checked={editFormData.isPublished}
                  onChange={onChange}
                  className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
                />
                <label htmlFor="edit-isPublished" className="ml-2 block text-sm text-gray-700">
                  Publish immediately
                </label>
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 transition-colors"
              >
                Update Article
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};