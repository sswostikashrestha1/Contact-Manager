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
  Heart,
  Sparkles,
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
        return "bg-sky-100/90 text-sky-800 border-sky-200";
      case "Work":
        return "bg-purple-100/90 text-purple-800 border-purple-200";
      case "Friend":
        return "bg-emerald-100/90 text-emerald-800 border-emerald-200";
      default:
        return "bg-rose-100/90 text-rose-800 border-rose-200";
    }
  };

  const categories = ["All", "Family", "Friend", "Work", "Other"];

  return (
    <div className="min-h-screen bg-mesh-gradient flex flex-col font-sans text-slate-800 selection:bg-purple-200 selection:text-purple-900">
      <Navbar />

      <main className="mx-auto max-w-7xl w-full px-4 py-8 sm:px-6 lg:px-8 flex-1">
        
        {/* Top Header Section */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-purple-950">
                Contact Directory
              </h1>
              <span className="rounded-full bg-purple-100 border border-purple-200 px-3 py-0.5 text-xs font-bold text-purple-800">
                {totalContacts} Saved
              </span>
            </div>
            <p className="mt-1 text-sm font-medium text-slate-500">
              Manage, search, and organize all your contacts seamlessly.
            </p>
          </div>

          <button
            onClick={openAddModal}
            className="group relative inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-purple-200 transition-all duration-200 hover:shadow-purple-300 hover:scale-[1.02] active:scale-95 self-start sm:self-auto"
          >
            <Plus size={18} className="transition-transform duration-200 group-hover:rotate-90" />
            Add New Contact
          </button>
        </div>

        {/* Statistics Bar Widgets - Pastel Dual Tone Contrast */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 mb-8">
          {/* Total Widget - Lavender Pastel */}
          <div className="relative overflow-hidden rounded-3xl bg-white/90 border border-purple-100 p-4 sm:p-5 shadow-lg shadow-purple-900/5 transition hover:shadow-xl hover:border-purple-200">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-purple-900 uppercase tracking-wider">
                Total Contacts
              </span>
              <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-purple-100 text-purple-700 ring-2 ring-purple-200/50">
                <Users size={18} />
              </div>
            </div>
            <p className="mt-3 text-3xl font-black tracking-tight text-purple-950">
              {totalContacts}
            </p>
            <div className="mt-1 text-[11px] font-semibold text-purple-700/70">
              All active records
            </div>
          </div>

          {/* Family Widget - Sky Blue Pastel */}
          <div className="relative overflow-hidden rounded-3xl bg-white/90 border border-sky-100 p-4 sm:p-5 shadow-lg shadow-sky-900/5 transition hover:shadow-xl hover:border-sky-200">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-sky-900 uppercase tracking-wider">
                Family
              </span>
              <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-sky-100 text-sky-700 ring-2 ring-sky-200/50">
                <Heart size={18} />
              </div>
            </div>
            <p className="mt-3 text-3xl font-black tracking-tight text-sky-950">
              {familyCount}
            </p>
            <div className="mt-1 text-[11px] font-semibold text-sky-700/70">
              Family members
            </div>
          </div>

          {/* Friends Widget - Mint Green Pastel Contrast */}
          <div className="relative overflow-hidden rounded-3xl bg-white/90 border border-emerald-100 p-4 sm:p-5 shadow-lg shadow-emerald-900/5 transition hover:shadow-xl hover:border-emerald-200">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-900 uppercase tracking-wider">
                Friends
              </span>
              <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700 ring-2 ring-emerald-200/50">
                <UserRound size={18} />
              </div>
            </div>
            <p className="mt-3 text-3xl font-black tracking-tight text-emerald-950">
              {friendCount}
            </p>
            <div className="mt-1 text-[11px] font-semibold text-emerald-700/70">
              Personal friends
            </div>
          </div>

          {/* Work Widget - Soft Violet Pastel */}
          <div className="relative overflow-hidden rounded-3xl bg-white/90 border border-indigo-100 p-4 sm:p-5 shadow-lg shadow-indigo-900/5 transition hover:shadow-xl hover:border-indigo-200">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-indigo-900 uppercase tracking-wider">
                Work
              </span>
              <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-700 ring-2 ring-indigo-200/50">
                <Briefcase size={18} />
              </div>
            </div>
            <p className="mt-3 text-3xl font-black tracking-tight text-indigo-950">
              {workCount}
            </p>
            <div className="mt-1 text-[11px] font-semibold text-indigo-700/70">
              Work colleagues
            </div>
          </div>
        </div>

        {/* Search, Filter & Layout Switcher Bar */}
        <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          
          {/* Search Input & Category Pills */}
          <div className="flex flex-1 flex-col gap-3.5 sm:flex-row sm:items-center">
            
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-purple-400">
                <Search size={17} />
              </div>
              <input
                type="text"
                placeholder="Search name, phone or email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-2xl border border-purple-100 bg-white/90 py-2.5 pl-10 pr-9 text-sm font-medium text-slate-800 placeholder-purple-300 outline-none transition duration-200 focus:border-purple-400 focus:ring-4 focus:ring-purple-100"
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-purple-400 hover:text-purple-700"
                >
                  <X size={15} />
                </button>
              )}
            </div>

            {/* Category Filter Pills (Pastel Dual Tone Contrast) */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`rounded-2xl px-4 py-2 text-xs font-bold whitespace-nowrap transition-all duration-200 ${
                    category === cat
                      ? "bg-purple-600 text-white shadow-md shadow-purple-200"
                      : "bg-white/80 text-slate-600 border border-purple-100 hover:border-purple-200 hover:text-purple-900"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

          </div>

          {/* View Toggle Button */}
          <div className="flex items-center rounded-2xl border border-purple-100 bg-white/90 p-1 self-start lg:self-auto shadow-xs">
            <button
              onClick={() => setViewMode("table")}
              className={`flex items-center gap-1.5 rounded-xl px-3.5 py-1.5 text-xs font-bold transition-all ${
                viewMode === "table"
                  ? "bg-purple-100 text-purple-900 shadow-xs"
                  : "text-slate-500 hover:text-slate-800"
              }`}
              title="Table view"
            >
              <TableIcon size={14} />
              <span>Table</span>
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`flex items-center gap-1.5 rounded-xl px-3.5 py-1.5 text-xs font-bold transition-all ${
                viewMode === "list"
                  ? "bg-purple-100 text-purple-900 shadow-xs"
                  : "text-slate-500 hover:text-slate-800"
              }`}
              title="Grid Cards view"
            >
              <LayoutList size={14} />
              <span>Cards</span>
            </button>
          </div>

        </div>

        {/* Content Section */}
        {loading ? (
          <div className="rounded-3xl border border-purple-100 bg-white/80 p-16 text-center text-sm font-semibold text-purple-700 backdrop-blur-md">
            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-purple-600 border-t-transparent mb-3" />
            Loading contacts...
          </div>
        ) : contacts.length === 0 ? (
          /* Empty State */
          <div className="rounded-3xl border border-dashed border-purple-200 bg-white/60 p-12 text-center backdrop-blur-md">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-3xl bg-purple-100 text-purple-700 ring-4 ring-purple-50">
              <Users size={28} />
            </div>
            <h3 className="mt-4 text-lg font-extrabold text-purple-950">No contacts saved yet</h3>
            <p className="mt-1 text-sm font-medium text-slate-500 max-w-sm mx-auto">
              Start building your contact directory by adding your first entry.
            </p>
            <button
              onClick={openAddModal}
              className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-purple-600 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-purple-200 hover:bg-purple-700 transition"
            >
              <Plus size={16} />
              Add Contact Now
            </button>
          </div>
        ) : filteredContacts.length === 0 ? (
          /* No Search Results */
          <div className="rounded-3xl border border-purple-100 bg-white/80 p-12 text-center backdrop-blur-md">
            <Search size={32} className="mx-auto text-purple-300" />
            <h3 className="mt-3 text-base font-extrabold text-purple-950">
              No contacts matching "{search}"
            </h3>
            <p className="mt-1 text-xs font-medium text-slate-500">
              Try adjusting your search terms or category filter.
            </p>
          </div>
        ) : viewMode === "table" ? (
          /* TABLE VIEW */
          <div className="overflow-hidden rounded-3xl border border-purple-100 bg-white/90 backdrop-blur-xl shadow-xl shadow-purple-900/5">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm border-collapse">
                <thead>
                  <tr className="border-b border-purple-100 bg-purple-50/60 text-[11px] font-extrabold text-purple-900 uppercase tracking-wider">
                    <th className="py-4 px-5">Contact</th>
                    <th className="py-4 px-5">Phone</th>
                    <th className="py-4 px-5 hidden md:table-cell">Email</th>
                    <th className="py-4 px-5 hidden lg:table-cell">Address</th>
                    <th className="py-4 px-5">Category</th>
                    <th className="py-4 px-5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-purple-100/60">
                  {filteredContacts.map((contact) => (
                    <tr
                      key={contact._id}
                      onClick={() => setSelectedContact(contact)}
                      className="group hover:bg-purple-50/40 cursor-pointer transition-colors duration-150"
                    >
                      {/* Name & Avatar */}
                      <td className="py-3.5 px-5">
                        <div className="flex items-center gap-3.5">
                          <div className="h-10 w-10 flex-shrink-0 rounded-full border border-purple-100 bg-gradient-to-br from-purple-100 to-emerald-100 flex items-center justify-center overflow-hidden ring-2 ring-white">
                            {contact.avatar ? (
                              <img
                                src={`${API_URL}${contact.avatar}`}
                                alt={contact.name}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <span className="text-sm font-extrabold text-purple-800">
                                {contact.name.charAt(0).toUpperCase()}
                              </span>
                            )}
                          </div>
                          <div>
                            <span className="font-bold text-slate-800 group-hover:text-purple-700 transition-colors">
                              {contact.name}
                            </span>
                            {contact.notes && (
                              <p className="text-[11px] font-medium text-slate-400 truncate max-w-[180px]">
                                {contact.notes}
                              </p>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Phone */}
                      <td className="py-3.5 px-5 text-slate-700 font-semibold whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <Phone size={14} className="text-purple-400" />
                          <span>{contact.phone}</span>
                        </div>
                      </td>

                      {/* Email */}
                      <td className="py-3.5 px-5 text-slate-500 font-medium hidden md:table-cell truncate max-w-xs">
                        {contact.email ? (
                          <div className="flex items-center gap-2">
                            <Mail size={14} className="text-purple-400" />
                            <span>{contact.email}</span>
                          </div>
                        ) : (
                          <span className="text-slate-300">—</span>
                        )}
                      </td>

                      {/* Address */}
                      <td className="py-3.5 px-5 text-slate-500 font-medium hidden lg:table-cell truncate max-w-xs">
                        {contact.address ? (
                          <div className="flex items-center gap-2">
                            <MapPin size={14} className="text-emerald-500" />
                            <span>{contact.address}</span>
                          </div>
                        ) : (
                          <span className="text-slate-300">—</span>
                        )}
                      </td>

                      {/* Category */}
                      <td className="py-3.5 px-5 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center rounded-full border px-3 py-0.5 text-xs font-bold ${getCategoryBadgeClass(
                            contact.category
                          )}`}
                        >
                          {contact.category || "Other"}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-5 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={(e) => openEditModal(contact, e)}
                            className="rounded-xl p-2 text-purple-600 hover:bg-purple-100 transition"
                            title="Edit contact"
                          >
                            <Pencil size={15} />
                          </button>
                          <button
                            onClick={(e) => handleDeleteContact(contact._id, e)}
                            className="rounded-xl p-2 text-rose-500 hover:bg-rose-100 transition"
                            title="Delete contact"
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
          /* GRID CARDS VIEW */
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredContacts.map((contact) => (
              <div
                key={contact._id}
                onClick={() => setSelectedContact(contact)}
                className="group relative flex flex-col justify-between rounded-3xl border border-purple-100 bg-white/90 p-5 cursor-pointer transition-all duration-200 hover:border-purple-200 hover:shadow-xl hover:shadow-purple-900/5"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div className="flex items-center gap-3.5">
                      <div className="h-12 w-12 flex-shrink-0 rounded-2xl border border-purple-100 bg-gradient-to-br from-purple-100 to-emerald-100 flex items-center justify-center overflow-hidden ring-2 ring-white">
                        {contact.avatar ? (
                          <img
                            src={`${API_URL}${contact.avatar}`}
                            alt={contact.name}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <span className="text-lg font-extrabold text-purple-800">
                            {contact.name.charAt(0).toUpperCase()}
                          </span>
                        )}
                      </div>
                      <div className="min-w-0">
                        <h4 className="font-extrabold text-slate-800 text-base truncate group-hover:text-purple-700 transition-colors">
                          {contact.name}
                        </h4>
                        <span
                          className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[10px] font-bold mt-1 ${getCategoryBadgeClass(
                            contact.category
                          )}`}
                        >
                          {contact.category || "Other"}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2 text-xs text-slate-600 border-t border-purple-50 pt-3.5">
                    <div className="flex items-center gap-2.5 font-semibold text-slate-800">
                      <Phone size={14} className="text-purple-500 flex-shrink-0" />
                      <span className="truncate">{contact.phone}</span>
                    </div>

                    {contact.email && (
                      <div className="flex items-center gap-2.5 font-medium text-slate-600">
                        <Mail size={14} className="text-purple-400 flex-shrink-0" />
                        <span className="truncate">{contact.email}</span>
                      </div>
                    )}

                    {contact.address && (
                      <div className="flex items-center gap-2.5 font-medium text-slate-600">
                        <MapPin size={14} className="text-emerald-500 flex-shrink-0" />
                        <span className="truncate">{contact.address}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-end gap-2 border-t border-purple-50 pt-3">
                  <button
                    onClick={(e) => openEditModal(contact, e)}
                    className="flex items-center gap-1 rounded-xl border border-purple-100 bg-purple-50/60 px-3 py-1.5 text-xs font-bold text-purple-800 hover:bg-purple-100 transition"
                  >
                    <Pencil size={13} /> Edit
                  </button>
                  <button
                    onClick={(e) => handleDeleteContact(contact._id, e)}
                    className="flex items-center gap-1 rounded-xl border border-rose-100 bg-rose-50/60 px-3 py-1.5 text-xs font-bold text-rose-700 hover:bg-rose-100 transition"
                  >
                    <Trash2 size={13} /> Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Contact Details Modal Drawer */}
        {selectedContact && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-purple-950/40 p-4 backdrop-blur-md">
            <div className="relative w-full max-w-lg rounded-3xl border border-purple-100 bg-white p-6 sm:p-7 shadow-2xl space-y-6">
              
              {/* Header */}
              <div className="flex items-start justify-between border-b border-purple-100 pb-5">
                <div className="flex items-center gap-4">
                  <div className="h-16 w-16 rounded-2xl border border-purple-100 bg-gradient-to-br from-purple-100 to-emerald-100 flex items-center justify-center overflow-hidden ring-4 ring-purple-50 shadow-md">
                    {selectedContact.avatar ? (
                      <img
                        src={`${API_URL}${selectedContact.avatar}`}
                        alt={selectedContact.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <User size={32} className="text-purple-700" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-extrabold text-purple-950 text-xl">
                      {selectedContact.name}
                    </h3>
                    <span
                      className={`inline-block rounded-full border px-3 py-0.5 text-xs font-bold mt-1 ${getCategoryBadgeClass(
                        selectedContact.category
                      )}`}
                    >
                      {selectedContact.category || "Other"}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedContact(null)}
                  className="rounded-2xl p-2 text-slate-400 hover:bg-purple-50 hover:text-purple-900 transition"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Detail Items */}
              <div className="space-y-4 text-sm text-slate-700">
                <div className="flex items-center gap-3.5 rounded-2xl bg-purple-50/50 border border-purple-100 p-3.5">
                  <Phone size={18} className="text-purple-600 flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="text-[10px] uppercase font-bold text-purple-800">Phone Number</p>
                    <a href={`tel:${selectedContact.phone}`} className="font-bold text-purple-950 hover:text-purple-600 transition">
                      {selectedContact.phone}
                    </a>
                  </div>
                </div>

                {selectedContact.email && (
                  <div className="flex items-center gap-3.5 rounded-2xl bg-purple-50/50 border border-purple-100 p-3.5">
                    <Mail size={18} className="text-purple-600 flex-shrink-0" />
                    <div className="min-w-0 flex-1">
                      <p className="text-[10px] uppercase font-bold text-purple-800">Email Address</p>
                      <a href={`mailto:${selectedContact.email}`} className="font-bold text-purple-950 hover:text-purple-600 transition">
                        {selectedContact.email}
                      </a>
                    </div>
                  </div>
                )}

                {selectedContact.address && (
                  <div className="flex items-center gap-3.5 rounded-2xl bg-emerald-50/50 border border-emerald-100 p-3.5">
                    <MapPin size={18} className="text-emerald-600 flex-shrink-0" />
                    <div className="min-w-0 flex-1">
                      <p className="text-[10px] uppercase font-bold text-emerald-800">Location Address</p>
                      <p className="font-bold text-emerald-950">{selectedContact.address}</p>
                    </div>
                  </div>
                )}

                {selectedContact.notes && (
                  <div className="flex items-start gap-3.5 rounded-2xl bg-amber-50/50 border border-amber-100 p-3.5">
                    <StickyNote size={18} className="text-amber-600 flex-shrink-0 mt-0.5" />
                    <div className="min-w-0 flex-1">
                      <p className="text-[10px] uppercase font-bold text-amber-800">Notes</p>
                      <p className="font-bold text-amber-950 whitespace-pre-wrap">{selectedContact.notes}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Modal Actions */}
              <div className="flex items-center justify-end gap-3 border-t border-purple-100 pt-5">
                <button
                  onClick={(e) => {
                    const c = selectedContact;
                    setSelectedContact(null);
                    openEditModal(c, e);
                  }}
                  className="inline-flex items-center gap-2 rounded-2xl border border-purple-200 bg-purple-50 px-4 py-2 text-xs font-bold text-purple-900 hover:bg-purple-100 transition"
                >
                  <Pencil size={14} />
                  Edit Contact
                </button>
                <button
                  onClick={(e) => handleDeleteContact(selectedContact._id, e)}
                  className="inline-flex items-center gap-2 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-2 text-xs font-bold text-rose-700 hover:bg-rose-100 transition"
                >
                  <Trash2 size={14} />
                  Delete
                </button>
              </div>

            </div>
          </div>
        )}

        {/* Add / Edit Contact Modal Dialog */}
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