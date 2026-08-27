import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import ContactModal from "../components/ContactModal";
import {
  Users,
  UserRound,
  Briefcase,
  Search,
  Plus,
  Pencil,
  Trash2,
  Phone,
  Mail,
  MapPin,
  Tag,
  LayoutList,
  Table as TableIcon,
  X,
  User,
  StickyNote,
} from "lucide-react";
import { API_URL } from "../context/AuthContext";

function Dashboard() {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);

  // View state
  const [viewMode, setViewMode] = useState("table"); // 'table' | 'list'

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingContact, setEditingContact] = useState(null);
  const [selectedContact, setSelectedContact] = useState(null);

  // Search & Filter
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      const response = await fetch(`${API_URL}/api/contacts`, {
        credentials: "include",
      });

      const data = await response.json();

      if (response.ok) {
        setContacts(data.contacts || []);
      } else {
        console.error(data.message);
      }
    } catch (error) {
      console.error("Failed to fetch contacts:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveContact = (savedContact, isEditing) => {
    if (isEditing) {
      setContacts((prev) =>
        prev.map((c) => (c._id === savedContact._id ? savedContact : c))
      );
      if (selectedContact?._id === savedContact._id) {
        setSelectedContact(savedContact);
      }
    } else {
      setContacts((prev) => [savedContact, ...prev]);
    }
  };

  const handleDeleteContact = async (id, e) => {
    if (e) e.stopPropagation();
    const confirmed = window.confirm(
      "Are you sure you want to delete this contact?"
    );

    if (!confirmed) return;

    try {
      const response = await fetch(`${API_URL}/api/contacts/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (response.ok) {
        setContacts((prev) => prev.filter((c) => c._id !== id));
        if (selectedContact?._id === id) {
          setSelectedContact(null);
        }
      } else {
        const data = await response.json();
        alert(data.message || "Failed to delete contact");
      }
    } catch (error) {
      console.error("Delete error:", error);
    }
  };

  const openAddModal = () => {
    setEditingContact(null);
    setIsModalOpen(true);
  };

  const openEditModal = (contact, e) => {
    if (e) e.stopPropagation();
    setEditingContact(contact);
    setIsModalOpen(true);
  };

  // Filtered contacts
  const filteredContacts = contacts.filter((contact) => {
    const query = search.toLowerCase();
    const matchesSearch =
      contact.name.toLowerCase().includes(query) ||
      contact.phone.toLowerCase().includes(query) ||
      (contact.email || "").toLowerCase().includes(query);

    const matchesCategory =
      category === "All" || contact.category === category;

    return matchesSearch && matchesCategory;
  });

  // Statistics
  const totalContacts = contacts.length;
  const familyCount = contacts.filter((c) => c.category === "Family").length;
  const friendCount = contacts.filter((c) => c.category === "Friend").length;
  const workCount = contacts.filter((c) => c.category === "Work").length;

  const getCategoryBadgeClass = (cat) => {
    switch (cat) {
      case "Family":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "Work":
        return "bg-purple-50 text-purple-700 border-purple-200";
      case "Friend":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans text-gray-900">
      <Navbar />

      <main className="mx-auto max-w-6xl w-full px-4 py-8 sm:px-6 flex-1">
        {/* Header Section */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
              Contacts Directory
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Manage, search, and organize your contact list easily.
            </p>
          </div>
          <button
            onClick={openAddModal}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-gray-800"
          >
            <Plus size={17} />
            Add Contact
          </button>
        </div>

        {/* Statistics Bar */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 mb-6">
          <div className="rounded-lg border border-gray-200 bg-white p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total
              </span>
              <Users size={16} className="text-gray-400" />
            </div>
            <p className="mt-2 text-2xl font-semibold text-gray-900">
              {totalContacts}
            </p>
          </div>

          <div className="rounded-lg border border-gray-200 bg-white p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                Family
              </span>
              <UserRound size={16} className="text-blue-500" />
            </div>
            <p className="mt-2 text-2xl font-semibold text-gray-900">
              {familyCount}
            </p>
          </div>

          <div className="rounded-lg border border-gray-200 bg-white p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                Friends
              </span>
              <Users size={16} className="text-emerald-500" />
            </div>
            <p className="mt-2 text-2xl font-semibold text-gray-900">
              {friendCount}
            </p>
          </div>

          <div className="rounded-lg border border-gray-200 bg-white p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                Work
              </span>
              <Briefcase size={16} className="text-purple-500" />
            </div>
            <p className="mt-2 text-2xl font-semibold text-gray-900">
              {workCount}
            </p>
          </div>
        </div>

        {/* Search, Filter & Layout Toggle Controls */}
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center">
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                placeholder="Search by name, phone or email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-lg border border-gray-200 bg-white py-2 pl-9 pr-4 text-sm outline-none transition focus:border-gray-400 focus:ring-2 focus:ring-gray-100"
              />
            </div>

            {/* Category Filter */}
            <div className="flex items-center gap-2">
              <Tag size={15} className="text-gray-400 hidden sm:inline" />
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-gray-400"
              >
                <option value="All">All Categories</option>
                <option value="Family">Family</option>
                <option value="Friend">Friend</option>
                <option value="Work">Work</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          {/* View Toggle */}
          <div className="flex items-center rounded-lg border border-gray-200 bg-white p-1 self-start sm:self-auto">
            <button
              onClick={() => setViewMode("table")}
              className={`flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium transition ${
                viewMode === "table"
                  ? "bg-gray-100 text-gray-900"
                  : "text-gray-500 hover:text-gray-700"
              }`}
              title="Table view"
            >
              <TableIcon size={14} />
              <span className="hidden sm:inline">Table</span>
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium transition ${
                viewMode === "list"
                  ? "bg-gray-100 text-gray-900"
                  : "text-gray-500 hover:text-gray-700"
              }`}
              title="List view"
            >
              <LayoutList size={14} />
              <span className="hidden sm:inline">List</span>
            </button>
          </div>
        </div>

        {/* Content Section */}
        {loading ? (
          <div className="rounded-xl border border-gray-200 bg-white p-12 text-center text-sm text-gray-500">
            Loading contacts...
          </div>
        ) : contacts.length === 0 ? (
          /* Empty State */
          <div className="rounded-xl border border-dashed border-gray-300 bg-white p-12 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 text-gray-500">
              <Users size={22} />
            </div>
            <h3 className="mt-4 font-semibold text-gray-900">No contacts yet</h3>
            <p className="mt-1 text-sm text-gray-500">
              Add your first contact to get started.
            </p>
            <button
              onClick={openAddModal}
              className="mt-5 inline-flex items-center gap-2 rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 transition"
            >
              <Plus size={16} />
              Add Contact
            </button>
          </div>
        ) : filteredContacts.length === 0 ? (
          /* No Search Results */
          <div className="rounded-xl border border-gray-200 bg-white p-10 text-center">
            <Search size={28} className="mx-auto text-gray-400" />
            <h3 className="mt-3 font-semibold text-gray-900">
              No contacts matching "{search}"
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Try adjusting your search criteria or category filter.
            </p>
          </div>
        ) : viewMode === "table" ? (
          /* TABLE VIEW */
          <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm border-collapse">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50/75 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    <th className="py-3 px-4">Contact</th>
                    <th className="py-3 px-4">Phone</th>
                    <th className="py-3 px-4 hidden md:table-cell">Email</th>
                    <th className="py-3 px-4 hidden lg:table-cell">Address</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredContacts.map((contact) => (
                    <tr
                      key={contact._id}
                      onClick={() => setSelectedContact(contact)}
                      className="hover:bg-gray-50/60 cursor-pointer transition"
                    >
                      {/* Name & Avatar */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="h-9 w-9 flex-shrink-0 rounded-full border border-gray-200 bg-gray-100 flex items-center justify-center overflow-hidden">
                            {contact.avatar ? (
                              <img
                                src={`${API_URL}${contact.avatar}`}
                                alt={contact.name}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <span className="text-sm font-semibold text-gray-600">
                                {contact.name.charAt(0).toUpperCase()}
                              </span>
                            )}
                          </div>
                          <span className="font-medium text-gray-900">
                            {contact.name}
                          </span>
                        </div>
                      </td>

                      {/* Phone */}
                      <td className="py-3 px-4 text-gray-600 whitespace-nowrap">
                        {contact.phone}
                      </td>

                      {/* Email */}
                      <td className="py-3 px-4 text-gray-500 hidden md:table-cell truncate max-w-xs">
                        {contact.email || "—"}
                      </td>

                      {/* Address */}
                      <td className="py-3 px-4 text-gray-500 hidden lg:table-cell truncate max-w-xs">
                        {contact.address || "—"}
                      </td>

                      {/* Category */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${getCategoryBadgeClass(
                            contact.category
                          )}`}
                        >
                          {contact.category || "Other"}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={(e) => openEditModal(contact, e)}
                            className="rounded-md p-1.5 text-gray-500 hover:bg-gray-100 hover:text-gray-800 transition"
                            title="Edit"
                          >
                            <Pencil size={15} />
                          </button>
                          <button
                            onClick={(e) => handleDeleteContact(contact._id, e)}
                            className="rounded-md p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-600 transition"
                            title="Delete"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          /* COMPACT LIST VIEW */
          <div className="space-y-2">
            {filteredContacts.map((contact) => (
              <div
                key={contact._id}
                onClick={() => setSelectedContact(contact)}
                className="flex items-center justify-between rounded-lg border border-gray-200 bg-white px-4 py-3 cursor-pointer hover:bg-gray-50 transition"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="h-10 w-10 flex-shrink-0 rounded-full border border-gray-200 bg-gray-100 flex items-center justify-center overflow-hidden">
                    {contact.avatar ? (
                      <img
                        src={`${API_URL}${contact.avatar}`}
                        alt={contact.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <span className="text-sm font-semibold text-gray-600">
                        {contact.name.charAt(0).toUpperCase()}
                      </span>
                    )}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold text-gray-900 text-sm truncate">
                        {contact.name}
                      </h4>
                      <span
                        className={`inline-flex items-center rounded-full border px-2 py-0.2 text-[11px] font-medium ${getCategoryBadgeClass(
                          contact.category
                        )}`}
                      >
                        {contact.category || "Other"}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-gray-500 mt-0.5">
                      <span className="flex items-center gap-1">
                        <Phone size={12} />
                        {contact.phone}
                      </span>
                      {contact.email && (
                        <span className="hidden sm:flex items-center gap-1 truncate">
                          <Mail size={12} />
                          {contact.email}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 flex-shrink-0">
                  <button
                    onClick={(e) => openEditModal(contact, e)}
                    className="rounded-lg border border-gray-200 px-2.5 py-1 text-xs font-medium text-gray-700 hover:bg-gray-50 transition"
                  >
                    Edit
                  </button>
                  <button
                    onClick={(e) => handleDeleteContact(contact._id, e)}
                    className="rounded-lg border border-red-200 px-2.5 py-1 text-xs font-medium text-red-600 hover:bg-red-50 transition"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Contact Details Modal / Drawer */}
        {selectedContact && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/50 p-4 backdrop-blur-xs">
            <div className="w-full max-w-md rounded-xl border border-gray-200 bg-white p-6 shadow-xl space-y-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-full border border-gray-200 bg-gray-100 flex items-center justify-center overflow-hidden">
                    {selectedContact.avatar ? (
                      <img
                        src={`${API_URL}${selectedContact.avatar}`}
                        alt={selectedContact.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <User size={24} className="text-gray-500" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg">
                      {selectedContact.name}
                    </h3>
                    <span
                      className={`inline-block rounded-full border px-2.5 py-0.5 text-xs font-medium ${getCategoryBadgeClass(
                        selectedContact.category
                      )}`}
                    >
                      {selectedContact.category || "Other"}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedContact(null)}
                  className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 transition"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="border-t border-gray-100 pt-4 space-y-3">
                <div className="flex items-center gap-3 text-sm text-gray-700">
                  <Phone size={16} className="text-gray-400 flex-shrink-0" />
                  <span>{selectedContact.phone}</span>
                </div>

                {selectedContact.email && (
                  <div className="flex items-center gap-3 text-sm text-gray-700">
                    <Mail size={16} className="text-gray-400 flex-shrink-0" />
                    <span>{selectedContact.email}</span>
                  </div>
                )}

                {selectedContact.address && (
                  <div className="flex items-center gap-3 text-sm text-gray-700">
                    <MapPin size={16} className="text-gray-400 flex-shrink-0" />
                    <span>{selectedContact.address}</span>
                  </div>
                )}

                {selectedContact.notes && (
                  <div className="flex items-start gap-3 text-sm text-gray-700">
                    <StickyNote size={16} className="text-gray-400 flex-shrink-0 mt-0.5" />
                    <span className="whitespace-pre-wrap">{selectedContact.notes}</span>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-end gap-2 border-t border-gray-100 pt-4">
                <button
                  onClick={(e) => {
                    const c = selectedContact;
                    setSelectedContact(null);
                    openEditModal(c, e);
                  }}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
                >
                  <Pencil size={14} />
                  Edit Contact
                </button>
                <button
                  onClick={(e) => handleDeleteContact(selectedContact._id, e)}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50 transition"
                >
                  <Trash2 size={14} />
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Add / Edit Contact Modal */}
        <ContactModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          contact={editingContact}
          onSave={handleSaveContact}
        />
      </main>
    </div>
  );
}

export default Dashboard;