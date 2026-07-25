import { useState, useRef, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useFetch } from "../hooks/useFetch";

const timeAgo = (date) => {
  const seconds = Math.floor((Date.now() - new Date(date)) / 1000);

  if (seconds < 60) return "Just now";
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;

  return new Date(date).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
  });
};

const getNotificationLink = (notification, role) => {
  if (notification.type === "order") {
    return role === "admin" ? "/admin/orders" : "/orders";
  }

  return "/";
};

export default function NotificationBell() {
  const [open, setOpen] = useState(false);
  const [notificationsState, setNotificationsState] = useState([]);
  const dropdownRef = useRef(null);
  const { token, role } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const { data: notifications = [], loading, error, refetch } = useFetch(
    import.meta.env.VITE_API + "notifications"
  );

  useEffect(() => {
    setNotificationsState(notifications);
  }, [notifications]);

  const unreadCount = notificationsState.filter((n) => !n.isRead).length;

  const markAsRead = async (id) => {
    const res = await fetch(`${import.meta.env.VITE_API}notifications/read/${id}`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) return;

    setNotificationsState((prev) =>
      prev.map((n) => (n._id === id ? { ...n, isRead: true } : n))
    );
  };

  const markAllAsRead = async () => {
    try {
      const unread = notificationsState.filter((n) => !n.isRead);
      if (unread.length === 0) return;

      await Promise.all(
        unread.map((n) =>
          fetch(`${import.meta.env.VITE_API}notifications/read/${n._id}`, {
            method: "PATCH",
            headers: { Authorization: `Bearer ${token}` },
          })
        )
      );

      setNotificationsState((prev) => prev.map((n) => ({ ...n, isRead: true })));
    } catch (err) {
      console.error("Failed to mark notifications as read", err);
    }
  };

  const handleBellClick = () => {
    const nextOpen = !open;
    setOpen(nextOpen);
    if (nextOpen) refetch();
  };

  const handleNotificationClick = async (notification) => {
    if (!notification.isRead) {
      await markAsRead(notification._id);
    }

    setOpen(false);
    navigate(getNotificationLink(notification, role));
  };

  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={handleBellClick}
        aria-label="Notifications"
        className="relative p-2 rounded-full hover:bg-gray-100 transition"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-6 h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0"
          />
        </svg>

        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 min-w-[1.25rem] h-5 px-1 bg-red-500 text-white text-[10px] font-semibold flex items-center justify-center rounded-full ring-2 ring-white">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-3 w-80 md:w-96 bg-white shadow-2xl rounded-2xl border border-gray-100 z-50 overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b bg-gray-50">
            <div>
              <h3 className="font-semibold text-gray-900">Notifications</h3>
              {unreadCount > 0 && (
                <p className="text-xs text-gray-500">{unreadCount} unread</p>
              )}
            </div>
            {unreadCount > 0 && (
              <button
                type="button"
                onClick={markAllAsRead}
                className="text-xs font-medium text-[#0B7C56] hover:text-[#095c40]"
              >
                Mark all read
              </button>
            )}
          </div>

          <div className="max-h-96 overflow-y-auto">
            {loading && (
              <div className="p-8 text-center text-gray-500 text-sm">Loading...</div>
            )}
            {error && (
              <div className="p-8 text-center text-red-500 text-sm">{error.message}</div>
            )}
            {!loading && !error && notificationsState.length === 0 && (
              <div className="p-8 text-center">
                <div className="mx-auto w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-6 h-6 text-gray-400"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0"
                    />
                  </svg>
                </div>
                <p className="text-sm text-gray-500">You&apos;re all caught up</p>
              </div>
            )}

            {!loading &&
              !error &&
              notificationsState.map((n) => (
                <button
                  key={n._id}
                  type="button"
                  onClick={() => handleNotificationClick(n)}
                  className={`w-full text-left p-4 border-b border-gray-100 hover:bg-gray-50 transition flex gap-3 ${
                    !n.isRead ? "bg-[#0B7C56]/5" : ""
                  }`}
                >
                  <div
                    className={`shrink-0 w-10 h-10 rounded-xl flex items-center justify-center ${
                      n.type === "order"
                        ? "bg-[#0B7C56]/10 text-[#0B7C56]"
                        : "bg-blue-100 text-blue-600"
                    }`}
                  >
                    {n.type === "order" ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-5 h-5"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.013 7.5h13.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
                        />
                      </svg>
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-5 h-5"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z"
                        />
                      </svg>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <p
                        className={`text-sm leading-snug ${
                          !n.isRead ? "font-semibold text-gray-900" : "text-gray-700"
                        }`}
                      >
                        {n.message}
                      </p>
                      {!n.isRead && (
                        <span className="shrink-0 w-2 h-2 mt-1.5 rounded-full bg-[#0B7C56]" />
                      )}
                    </div>
                    <div className="flex items-center gap-2 mt-1.5">
                      <span className="text-[11px] uppercase tracking-wide font-medium text-[#0B7C56]">
                        {n.type === "order" ? "Order update" : "System"}
                      </span>
                      <span className="text-xs text-gray-400">{timeAgo(n.createdAt)}</span>
                    </div>
                  </div>
                </button>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}
