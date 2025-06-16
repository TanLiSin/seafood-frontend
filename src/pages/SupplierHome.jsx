import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './SupplierHome.css';

function SupplierHome() {
  const [supplierName, setSupplierName] = useState('');
  const [notifications, setNotifications] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();

  const user_id = localStorage.getItem('user_id');

  useEffect(() => {
    // Replace the URL below with your actual backend endpoint
    fetch(`${import.meta.env.VITE_NODE_API}/api/users`)
      .then((response) => response.json())
      .then((data) => {
        // If user login is not implemented yet, just use the first user as placeholder
        const supplier = data.find(user => user.role === 'Supplier') || data[0];
        setSupplierName(supplier?.username || 'Supplier');
      })
      .catch((error) => {
        console.error('Error fetching supplier name:', error);
        setSupplierName('Supplier'); // fallback name
      });
  }, []);

  // Fetch notifications
  const fetchNotifications = async () => {
    if (!user_id) return;
    const res = await fetch(`${import.meta.env.VITE_NODE_API}/api/notifications?user_id=${user_id}`);
    const data = await res.json();
    setNotifications(data);
  };

  useEffect(() => {
    fetchNotifications();
  }, [user_id]);

  // Mark notification as read
  const markAsRead = async (id) => {
    await fetch(`${import.meta.env.VITE_NODE_API}/api/notifications/${id}/read`, {
      method: 'PATCH'
    });
    fetchNotifications();
  };

  const unreadCount = notifications.filter(n => !n.is_read).length;
  
function handleLogout(navigate) {
  localStorage.clear(); // ✅ Clear all stored user data
  navigate('/'); // 🔄 Redirect to login or home
}

  return (
    <div className="supplier-page">
      <header>
        <div className="left-section">
           {/* Notification Bell with Dropdown */}
          <div style={{ position: 'relative', marginRight: '10px' }}>
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              style={{
                fontSize: '1.5rem',
                background: 'none',
                border: 'none',
                cursor: 'pointer'
              }}
            >
              🔔{unreadCount > 0 && <span style={{ color: 'red' }}>●</span>}
            </button>

            {showDropdown && (
            <div style={{
              position: 'absolute',
              top: '35px',
              left: '0',
              backgroundColor: 'white',
              border: '1px solid #ccc',
              borderRadius: '8px',
              boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
              width: '300px',
              zIndex: 1000,
              maxHeight: '300px',
              overflowY: 'auto'
            }}>
              <h4 style={{ margin: '10px' }}>Notifications</h4>
              {notifications.length === 0 ? (
                <p style={{ margin: '10px' }}>No notifications.</p>
              ) : (
                notifications.map(n => (
                  <div
                    key={n.id}
                    style={{
                      padding: '10px',
                      borderBottom: '1px solid #eee',
                      backgroundColor: n.is_read ? '#f9f9f9' : '#e8f4ff',
                      cursor: 'pointer'
                    }}
                    onClick={() => markAsRead(n.id)}
                  >
                    {n.message}
                    <div style={{ fontSize: '0.75rem', color: '#555' }}>
                      {new Date(n.created_at).toLocaleString()}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
          </div>
          <h1 className="brand">SUPPLIER</h1>
        </div>
        <nav className="nav-links">
          <Link to="/supplier-home" className="active">HOME</Link>
          <Link to="/transaction">TRANSACTION</Link>
          <Link to="/catch-record">CATCH RECORD</Link>
          <Link to="/shared-ledger">SHARED LEDGER</Link>
          <Link to="/track-recall">TRACK & RECALL</Link>
        </nav>
        <Link to="/" className="logout" onClick={handleLogout}>LOGOUT ⤴</Link>
      </header>

      <main>
        <div className="banner">
          <img src="/pictures/catch.png" alt="Catch Record" />
          <Link to="/catch-record" className="banner-text">
            Catch Record Authentication
          </Link>
        </div>

        <div className="welcome-section">
          <h2>
            Welcome, {supplierName} as Supplier!
          </h2>
          <div className="feature-boxes">
            <div className="feature">
              <img src="/pictures/transaction.png" alt="Transactions" />
              <Link to="/transaction"><button>Transactions</button></Link>
            </div>
            <div className="feature">
              <img src="/pictures/ledger.jpg" alt="Shared Ledger" />
              <Link to="/shared-ledger"><button>Shared Ledger</button></Link>
            </div>
            <div className="feature">
              <img src="/pictures/track-recall.png" alt="Track & Recall" />
              <Link to="/track-recall"><button>Track & Recall</button></Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default SupplierHome;
