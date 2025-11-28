import { NewsArticle } from "./types";

interface ViewArticleModalProps {
  article: NewsArticle;
  onClose: () => void;
}

export const ViewArticleModal: React.FC<ViewArticleModalProps> = ({ article, onClose }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="fixed inset-0 bg-gray-600/70 bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-900">Article Preview</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-100"
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <article className="prose prose-lg max-w-none">
            {article.imageUrl && (
              <img
                src={article.imageUrl}
                alt={article.title}
                className="w-full h-64 object-cover rounded-lg mb-6"
              />
            )}
            
            <div className="mb-4">
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                article.isPublished 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-yellow-100 text-yellow-800'
              }`}>
                {article.isPublished ? 'Published' : 'Draft'}
              </span>
              <span className="ml-2 inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800 capitalize">
                {article.category}
              </span>
            </div>
            
            <h1 className="text-3xl font-bold text-gray-900 mb-4">{article.title}</h1>
            
            <div className="text-sm text-gray-500 mb-6">
              Published on {formatDate(article.publishedAt)}
            </div>
            
            {article.excerpt && (
              <div className="bg-gray-50 p-4 rounded-lg mb-6">
                <h3 className="font-semibold text-gray-900 mb-2">Excerpt:</h3>
                <p className="text-gray-700">{article.excerpt}</p>
              </div>
            )}
            
            <div className="whitespace-pre-wrap text-gray-800 leading-relaxed">
              {article.content}
            </div>
          </article>
        </div>
      </div>
    </div>
  );
};