import { useState, useEffect } from "react";
import { FiEdit2, FiTrash2, FiCheck, FiX, FiSearch } from "react-icons/fi";
import { fetchUsers, updateUserApproval, deleteUser } from "../services/api";
import Table from "../components/Table";
import "../styles/tables.css";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const usersData = await fetchUsers();
        setUsers(usersData);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };
    loadUsers();
  }, []);

  const handleApprove = async (userId, isApproved) => {
    try {
      await updateUserApproval(userId, isApproved);
      setUsers(
        users.map((user) =>
          user.id === userId ? { ...user, is_approved: isApproved } : user
        )
      );
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (userId) => {
    try {
      await deleteUser(userId);
      setUsers(users.filter((user) => user.id !== userId));
    } catch (err) {
      setError(err.message);
    }
  };

  const filteredUsers = users.filter(
    (user) =>
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="text-center py-8">Loading users...</div>;
  if (error)
    return <div className="text-center py-8 text-red-500">Error: {error}</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Users Management</h1>
        <div className="relative">
          <input
            type="text"
            placeholder="Search users..."
            className="search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <FiSearch className="search-icon" />
        </div>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      <Table>
        <thead>
          <tr>
            <th className="table-header-cell">Username</th>
            <th className="table-header-cell">Email</th>
            <th className="table-header-cell">Role</th>
            <th className="table-header-cell">Status</th>
            <th className="table-header-cell">Created At</th>
            <th className="table-header-cell text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map((user) => (
            <tr key={user.id} className="table-row">
              <td className="table-cell">
                <div className="avatar-cell">
                  <div className="avatar avatar-blue">
                    {user.username.charAt(0).toUpperCase()}
                  </div>
                  <div className="cell-content">
                    <div className="text-sm font-medium text-gray-900">
                      {user.username}
                    </div>
                  </div>
                </div>
              </td>
              <td className="table-cell text-sm text-gray-500">{user.email}</td>
              <td className="table-cell">
                <span
                  className={`status-badge ${
                    user.role === "doctor"
                      ? "bg-purple-100 text-purple-800"
                      : user.role === "admin"
                      ? "bg-red-100 text-red-800"
                      : "bg-green-100 text-green-800"
                  }`}
                >
                  {user.role}
                </span>
              </td>
              <td className="table-cell">
                <span
                  className={`status-badge ${
                    user.is_approved
                      ? "status-approved"
                      : "status-pending-approval"
                  }`}
                >
                  {user.is_approved ? "Approved" : "Pending"}
                </span>
              </td>
              <td className="table-cell text-sm text-gray-500">
                {user.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}
              </td>
              <td className="table-cell text-right">
                <div className="actions-cell">
                  {user.role !== "admin" && (
                    <button
                      onClick={() => handleApprove(user.id, !user.is_approved)}
                      className={`action-btn ${
                        user.is_approved
                          ? "text-red-600 hover:text-red-900"
                          : "text-green-600 hover:text-green-900"
                      }`}
                      title={user.is_approved ? "Disapprove" : "Approve"}
                    >
                      {user.is_approved ? (
                        <FiX size={18} />
                      ) : (
                        <FiCheck size={18} />
                      )}
                    </button>
                  )}
                  <button className="action-btn edit-btn" title="Edit">
                    <FiEdit2 size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(user.id)}
                    className="action-btn delete-btn"
                    title="Delete"
                  >
                    <FiTrash2 size={18} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default Users;