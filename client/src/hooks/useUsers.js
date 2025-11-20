import { useState, useEffect, useCallback, useMemo } from "react";
import { getAllUsers, updateUserRole, deleteUser } from "@/data";
import { toast } from "react-toastify";

export const useUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [sortField, setSortField] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");
  const [searchSuggestions, setSearchSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const loadUsers = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getAllUsers();
      setUsers(data);
    } catch {
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  const handleRoleChange = async (userId, newRole) => {
    try {
      await updateUserRole(userId, newRole);
      toast.success("User role updated successfully!");
      loadUsers();
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await deleteUser(userId);
        toast.success("User deleted successfully!");
        loadUsers();
      } catch (error) {
        toast.error(error.message);
      }
    }
  };

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearch(value);

    if (value.length >= 2) {
      const suggestions = users
        .filter((u) => {
          const searchLower = value.toLowerCase();
          const fullName = `${u.firstName} ${u.lastName}`.toLowerCase();
          return (
            fullName.includes(searchLower) ||
            u.email.toLowerCase().includes(searchLower)
          );
        })
        .slice(0, 5)
        .map((u) => ({
          id: u._id,
          text: `${u.firstName} ${u.lastName}`,
          subtext: u.email,
        }));

      setSearchSuggestions(suggestions);
      setShowSuggestions(suggestions.length > 0);
    } else {
      setSearchSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("desc");
    }
  };

  const filteredUsers = useMemo(() => {
    return users
      .filter((userData) => {
        if (filter === "admin") {
          if (userData.role !== "ADMIN") return false;
        } else if (filter === "user") {
          if (userData.role === "ADMIN") return false;
        }

        if (search.trim()) {
          const searchLower = search.toLowerCase();
          const fullName =
            `${userData.firstName} ${userData.lastName}`.toLowerCase();
          const matchesName = fullName.includes(searchLower);
          const matchesEmail = userData.email
            .toLowerCase()
            .includes(searchLower);

          if (!matchesName && !matchesEmail) return false;
        }

        return true;
      })
      .sort((a, b) => {
        let aValue, bValue;

        switch (sortField) {
          case "name":
            aValue = `${a.firstName} ${a.lastName}`.toLowerCase();
            bValue = `${b.firstName} ${b.lastName}`.toLowerCase();
            break;
          case "email":
            aValue = a.email.toLowerCase();
            bValue = b.email.toLowerCase();
            break;
          case "role":
            aValue = a.role;
            bValue = b.role;
            break;
          case "createdAt":
          default:
            aValue = new Date(a.createdAt);
            bValue = new Date(b.createdAt);
            break;
        }

        if (aValue < bValue) return sortOrder === "asc" ? -1 : 1;
        if (aValue > bValue) return sortOrder === "asc" ? 1 : -1;
        return 0;
      });
  }, [users, filter, search, sortField, sortOrder]); // Only recalculate when these change

  return {
    users: filteredUsers,
    loading,
    filter,
    setFilter,
    search,
    handleSearch,
    sortField,
    sortOrder,
    handleSort,
    searchSuggestions,
    showSuggestions,
    setShowSuggestions,
    setSearch,
    handleRoleChange,
    handleDeleteUser,
    reload: loadUsers,
  };
};
