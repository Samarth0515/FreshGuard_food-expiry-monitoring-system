import React, { useEffect, useRef, useState } from "react";
import { useAuth } from "../../context/AuthContext.jsx";
import { getNotifications, markAllAsRead, markAsRead } from "../../services/notificationService";
import "./NotificationBell.css";

export default function NotificationBell() {
  const { currentUser } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);

  const fetchUserNotifications = async () => {
    if (!currentUser) return;
    try {
      const list = await getNotifications();
      setNotifications(Array.isArray(list) ? list : []);
    } catch {
      // ignore in background
    }
  };

  useEffect(() => {
    if (!currentUser) {
      setNotifications([]);
      return;
    }

    fetchUserNotifications();

    // 60 seconds polling interval
    const interval = setInterval(fetchUserNotifications, 60000);
    return () => clearInterval(interval);
  }, [currentUser]);

  // Click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const handleMarkAsRead = async (e, id) => {
    e.stopPropagation();
    try {
      await markAsRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
      );
    } catch (err) {
      console.error(err);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    } catch (err) {
      console.error(err);
    }
  };

  if (!currentUser) return null;

  return (
    <div className="notification-bell-container" ref={containerRef}>
      <button
        className="notification-bell-btn"
        onClick={() => setOpen(!open)}
        title="Notifications"
        aria-label="Notifications"
      >
        🔔
        {unreadCount > 0 && <span className="notification-badge">{unreadCount}</span>}
      </button>

      {open && (
        <div className="notification-dropdown">
          <div className="notification-header">
            <h4>Alerts & Notifications</h4>
            <span style={{ fontSize: "0.8rem", color: "#64748b" }}>
              {unreadCount} unread
            </span>
          </div>

          <ul className="notification-list">
            {notifications.length === 0 ? (
              <li className="notification-empty">No new notifications 🎉</li>
            ) : (
              notifications.slice(0, 5).map((item) => (
                <li
                  key={item.id}
                  className={`notification-item ${!item.isRead ? "unread" : ""}`}
                >
                  <div className="notification-content">
                    {item.alertType === "TODAY_EXPIRY" && "🚨 "}
                    {item.alertType === "UPCOMING_EXPIRY" && "⚠️ "}
                    {item.alertType === "ALREADY_EXPIRED" && "❌ "}
                    {item.message}
                  </div>
                  <div className="notification-meta">
                    <span>
                      {item.sentAt
                        ? new Date(item.sentAt).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : "Today"}
                    </span>
                    {!item.isRead && (
                      <button
                        className="mark-read-btn"
                        onClick={(e) => handleMarkAsRead(e, item.id)}
                      >
                        Mark as read
                      </button>
                    )}
                  </div>
                </li>
              ))
            )}
          </ul>

          {notifications.length > 0 && (
            <div className="notification-footer">
              <button className="mark-all-btn" onClick={handleMarkAllAsRead}>
                Mark all as read
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
