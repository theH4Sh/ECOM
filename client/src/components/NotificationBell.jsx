import { useState, useRef, useEffect } from "react";
import { useSelector } from "react-redux";
import { useFetch } from "../hooks/useFetch";
import React from "react";

export default function NotificationBell() {
  const [open, setOpen] = useState(false);
  const [notificationsState, setNotificationsState] = useState([]);
  const dropdownRef = useRef(null);
  const { token } = useSelector(state => state.auth);

  const { data: notifications = [], loading, error } = useFetch(
    "http://localhost:8000/api/notifications"
  );

  // Sync fetched notifications into local state
  useEffect(() => {
    setNotificationsState(notifications);
  }, [notifications]);

  const unreadCount = notificationsState.filter(n => !n.isRead).length;

  // Mark all unread notifications as read
  const markAllAsRead = async () => {
    try {
      const unread = notificationsState.filter(n => !n.isRead);
      if (unread.length === 0) return;

      await Promise.all(
        unread.map(n =>
          fetch(`http://localhost:8000/api/notifications/read/${n._id}`, {
            method: "PATCH",
            headers: { Authorization: `Bearer ${token}` },
          })
        )
      );

      // Update state properly so React re-renders
      setNotificationsState(prev =>
        prev.map(n => ({ ...n, isRead: true }))
      );
    } catch (err) {
      console.error("Failed to mark notifications as read", err);
    }
  };

  // Open/close dropdown and mark as read
  const handleBellClick = async () => {
    setOpen(!open);
    if (!open) {
      await markAllAsRead();
    }
  };

  // Close dropdown when clicking outside
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
      {/* Bell */}
      <button
        onClick={handleBellClick}
        className="relative p-2 rounded-full hover:bg-gray-100"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" />
        </svg>

        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 mt-3 w-72 md:w-80 bg-white shadow-xl rounded-xl border z-50">
          <div className="p-3 font-semibold border-b">Notifications</div>

          <div className="max-h-80 overflow-y-auto">
            {loading && <p className="p-4 text-center text-gray-500">Loading...</p>}
            {error && <p className="p-4 text-center text-red-500">Failed to load notifications</p>}
            {!loading && !error && notificationsState.length === 0 && <p className="p-4 text-center text-gray-500">No notifications</p>}

            {!loading && !error && notificationsState.map((n) => (
              <div
                key={n._id}
                className={`p-4 border-b hover:bg-gray-50 ${!n.isRead ? "bg-blue-50" : ""}`}
              >
                <p className="text-sm">{n.message}</p>
                <span className="text-xs text-gray-400">{new Date(n.createdAt).toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
