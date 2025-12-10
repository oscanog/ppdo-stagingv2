"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useAccentColor } from "../../contexts/AccentColorContext";

interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "user" | "viewer";
  department: string;
  status: "active" | "inactive" | "suspended";
  lastLogin: string;
  createdAt: string;
  avatar?: string;
}

const mockUsers: User[] = [
  {
    id: "1",
    name: "Maria Cristina Santos",
    email: "maria.santos@tarlac.gov.ph",
    role: "admin",
    department: "Administrative Office",
    status: "active",
    lastLogin: "2 hours ago",
    createdAt: "Jan 15, 2024",
    avatar: "https://i.pravatar.cc/150?img=47",
  },
  {
    id: "2",
    name: "Juan Dela Cruz",
    email: "juan.delacruz@tarlac.gov.ph",
    role: "user",
    department: "Finance Department",
    status: "active",
    lastLogin: "1 day ago",
    createdAt: "Feb 3, 2024",
    avatar: "https://i.pravatar.cc/150?img=12",
  },
  {
    id: "3",
    name: "Ana Garcia",
    email: "ana.garcia@tarlac.gov.ph",
    role: "user",
    department: "HR Department",
    status: "active",
    lastLogin: "3 hours ago",
    createdAt: "Mar 10, 2024",
    avatar: "https://i.pravatar.cc/150?img=24",
  },
  {
    id: "4",
    name: "Roberto Martinez",
    email: "roberto.martinez@tarlac.gov.ph",
    role: "viewer",
    department: "Planning Office",
    status: "active",
    lastLogin: "1 week ago",
    createdAt: "Apr 5, 2024",
    avatar: "https://i.pravatar.cc/150?img=33",
  },
  {
    id: "5",
    name: "Sofia Torres",
    email: "sofia.torres@tarlac.gov.ph",
    role: "user",
    department: "Legal Department",
    status: "inactive",
    lastLogin: "2 weeks ago",
    createdAt: "May 12, 2024",
    avatar: "https://i.pravatar.cc/150?img=45",
  },
  {
    id: "6",
    name: "Carlos Mendoza",
    email: "carlos.mendoza@tarlac.gov.ph",
    role: "user",
    department: "Engineering Office",
    status: "active",
    lastLogin: "5 minutes ago",
    createdAt: "Jun 8, 2024",
    avatar: "https://i.pravatar.cc/150?img=15",
  },
  {
    id: "7",
    name: "Liza Rodriguez",
    email: "liza.rodriguez@tarlac.gov.ph",
    role: "viewer",
    department: "Health Office",
    status: "suspended",
    lastLogin: "1 month ago",
    createdAt: "Jul 20, 2024",
    avatar: "https://i.pravatar.cc/150?img=50",
  },
  {
    id: "8",
    name: "Pedro Santos",
    email: "pedro.santos@tarlac.gov.ph",
    role: "user",
    department: "General Services",
    status: "active",
    lastLogin: "30 minutes ago",
    createdAt: "Aug 15, 2024",
    avatar: "https://i.pravatar.cc/150?img=28",
  },
];

export default function UserManagementPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterRole, setFilterRole] = useState<"all" | User["role"]>("all");
  const [filterStatus, setFilterStatus] = useState<"all" | User["status"]>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [showAddModal, setShowAddModal] = useState(false);
  const router = useRouter();
  const { accentColorValue } = useAccentColor();

  // useEffect(() => {
  //   const auth = localStorage.getItem("authenticated");
  //   if (auth === "true") {
  //     setIsAuthenticated(true);
  //   } else {
  //     router.push("/");
  //   }
  // }, [router]);

  const filteredUsers = useMemo(() => {
    let filtered = users;

    if (filterRole !== "all") {
      filtered = filtered.filter((user) => user.role === filterRole);
    }

    if (filterStatus !== "all") {
      filtered = filtered.filter((user) => user.status === filterStatus);
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (user) =>
          user.name.toLowerCase().includes(query) ||
          user.email.toLowerCase().includes(query) ||
          user.department.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [users, filterRole, filterStatus, searchQuery]);

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedUsers = filteredUsers.slice(startIndex, endIndex);

  useEffect(() => {
    setCurrentPage(1);
  }, [filterRole, filterStatus, searchQuery]);

  const getRoleColor = (role: User["role"]) => {
    switch (role) {
      case "admin":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400";
      case "user":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400";
      case "viewer":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
      default:
        return "bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-400";
    }
  };

  const getStatusColor = (status: User["status"]) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
      case "inactive":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400";
      case "suspended":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";
      default:
        return "bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-400";
    }
  };

  // if (!isAuthenticated) {
  //   return null;
  // }

  return (
    <>
      {/* Page Header */}
      <div className="mb-4">
        <div className="flex items-center justify-between">
          <div>
            <h1
              className="text-3xl sm:text-4xl font-semibold text-zinc-900 dark:text-zinc-100 mb-1"
              style={{ fontFamily: "var(--font-cinzel), serif" }}
            >
              User Management
            </h1>
            <p className="text-zinc-600 dark:text-zinc-400">
              Manage system users and access permissions
            </p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 rounded-lg font-medium transition-all hover:shadow-md text-white"
            style={{ backgroundColor: accentColorValue }}
          >
            <div className="flex items-center gap-2">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              <span>Add User</span>
            </div>
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-4 sm:p-6 mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Search by name, email, or department..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 pl-10 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50 placeholder:text-zinc-500 dark:placeholder:text-zinc-500 focus:outline-none focus:ring-2 transition-all"
              style={
                {
                  "--tw-ring-color": accentColorValue,
                } as React.CSSProperties
              }
              onFocus={(e) => {
                e.currentTarget.style.borderColor = accentColorValue;
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = "";
              }}
            />
            <svg
              className="absolute left-3 top-2.5 w-5 h-5 text-zinc-400 dark:text-zinc-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>

          {/* Role Filter */}
          <select
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value as typeof filterRole)}
            className="px-4 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50 focus:outline-none focus:ring-2 transition-all"
            style={
              {
                "--tw-ring-color": accentColorValue,
              } as React.CSSProperties
            }
            onFocus={(e) => {
              e.currentTarget.style.borderColor = accentColorValue;
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = "";
            }}
          >
            <option value="all">All Roles</option>
            <option value="admin">Admin</option>
            <option value="user">User</option>
            <option value="viewer">Viewer</option>
          </select>

          {/* Status Filter */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as typeof filterStatus)}
            className="px-4 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50 focus:outline-none focus:ring-2 transition-all"
            style={
              {
                "--tw-ring-color": accentColorValue,
              } as React.CSSProperties
            }
            onFocus={(e) => {
              e.currentTarget.style.borderColor = accentColorValue;
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = "";
            }}
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="suspended">Suspended</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950">
                <th className="px-6 py-4 text-left text-xs font-semibold text-zinc-700 dark:text-zinc-300 uppercase tracking-wide">
                  User
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-zinc-700 dark:text-zinc-300 uppercase tracking-wide">
                  Role
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-zinc-700 dark:text-zinc-300 uppercase tracking-wide">
                  Department
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-zinc-700 dark:text-zinc-300 uppercase tracking-wide">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-zinc-700 dark:text-zinc-300 uppercase tracking-wide">
                  Last Login
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-zinc-700 dark:text-zinc-300 uppercase tracking-wide">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
              {paginatedUsers.length > 0 ? (
                paginatedUsers.map((user) => (
                  <tr
                    key={user.id}
                    className="hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=${accentColorValue.replace('#', '')}&color=fff`}
                          alt={user.name}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                        <div>
                          <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                            {user.name}
                          </p>
                          <p className="text-xs text-zinc-500 dark:text-zinc-400">
                            {user.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium capitalize ${getRoleColor(
                          user.role
                        )}`}
                      >
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-zinc-700 dark:text-zinc-300">
                        {user.department}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(
                          user.status
                        )}`}
                      >
                        {user.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-zinc-600 dark:text-zinc-400">
                        {user.lastLogin}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          className="p-1.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                          title="Edit"
                        >
                          <svg
                            className="w-4 h-4 text-zinc-600 dark:text-zinc-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                            />
                          </svg>
                        </button>
                        <button
                          className="p-1.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                          title="Delete"
                        >
                          <svg
                            className="w-4 h-4 text-red-600 dark:text-red-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <p className="text-sm text-zinc-500 dark:text-zinc-400">
                      No users found matching your search.
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1.5 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300"
              >
                Previous
              </button>
              <span className="text-sm text-zinc-500 dark:text-zinc-400">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-1.5 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300"
              >
                Next
              </button>
            </div>
            <div className="text-sm text-zinc-500 dark:text-zinc-400">
              Showing {startIndex + 1}-{Math.min(endIndex, filteredUsers.length)} of{" "}
              {filteredUsers.length} users
            </div>
          </div>
        )}
      </div>

      {/* Add User Modal - Placeholder */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-2xl w-full max-w-md">
            <div className="p-6 border-b border-zinc-200 dark:border-zinc-800">
              <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                Add New User
              </h2>
            </div>
            <div className="p-6">
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                Add user form will be implemented here.
              </p>
            </div>
            <div className="p-6 border-t border-zinc-200 dark:border-zinc-800 flex items-center justify-end gap-2">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 rounded-lg text-sm font-medium transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300"
              >
                Cancel
              </button>
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 rounded-lg text-sm font-medium transition-all hover:shadow-md text-white"
                style={{ backgroundColor: accentColorValue }}
              >
                Add User
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

