import { NotificationType } from "./types";

interface NotificationProps {
  notification: NotificationType;
}

export const Notification: React.FC<NotificationProps> = ({ notification }) => {
  if (!notification) return null;

  return (
    <div className={`mb-6 p-4 rounded-lg border ${
      notification.type === 'success' 
        ? 'bg-green-50 text-green-800 border-green-200' 
        : notification.type === 'error'
        ? 'bg-red-50 text-red-800 border-red-200'
        : 'bg-blue-50 text-blue-800 border-blue-200'
    }`}>
      <div className="flex items-center">
        <div className="flex-shrink-0">
          {notification.type === 'success' && (
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          )}
          {notification.type === 'error' && (
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          )}
        </div>
        <div className="ml-3">{notification.message}</div>
      </div>
    </div>
  );
};