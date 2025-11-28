import { NewsArticle } from "./types";
import { ArticleRow } from "./ArticleRow";
import { Pagination } from "./Pagination";

interface ArticleTableProps {
  articles: NewsArticle[];
  loading: boolean;
  searchTerm: string;
  categoryFilter: string;
  statusFilter: string;
  currentPage: number;
  itemsPerPage: number;
  totalPages: number;
  setCurrentPage: (page: number) => void;
  setSelectedArticle: (article: NewsArticle) => void;
  handleEdit: (article: NewsArticle) => void;
  togglePublishStatus: (article: NewsArticle) => void;
  setDeleteArticleId: (id: number) => void;
  setShowDeleteModal: (show: boolean) => void;
  router: any;
}

export const ArticleTable: React.FC<ArticleTableProps> = ({
  articles,
  loading,
  searchTerm,
  categoryFilter,
  statusFilter,
  currentPage,
  itemsPerPage,
  totalPages,
  setCurrentPage,
  setSelectedArticle,
  handleEdit,
  togglePublishStatus,
  setDeleteArticleId,
  setShowDeleteModal,
  router,
}) => {
  if (loading) {
    return (
      <div className="p-8 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading articles...</p>
      </div>
    );
  }

  if (articles.length === 0) {
    return (
      <div className="p-8 text-center">
        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <h3 className="mt-2 text-sm font-medium text-gray-900">No articles found</h3>
        <p className="mt-1 text-sm text-gray-500">
          {searchTerm || categoryFilter !== "all" || statusFilter !== "all"
            ? "Try adjusting your filters or search term."
            : "Get started by creating your first article."
          }
        </p>
        {!(searchTerm || categoryFilter !== "all" || statusFilter !== "all") && (
          <div className="mt-6">
            <button
              onClick={() => router.push('/admin/add-news')}
              className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors"
            >
              + Add New Article
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Article
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Category
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Published Date
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {articles.map((article) => (
              <ArticleRow
                key={article.id}
                article={article}
                setSelectedArticle={setSelectedArticle}
                handleEdit={handleEdit}
                togglePublishStatus={togglePublishStatus}
                setDeleteArticleId={setDeleteArticleId}
                setShowDeleteModal={setShowDeleteModal}
              />
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          itemsPerPage={itemsPerPage}
          totalItems={articles.length}
          setCurrentPage={setCurrentPage}
        />
      )}
    </>
  );
};