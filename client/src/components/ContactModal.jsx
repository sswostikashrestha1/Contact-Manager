import { useState, useEffect } from "react";
import {
  X,
  User,
  Phone,
  Mail,
  MapPin,
  StickyNote,
  Tag,
  Upload,
  Sparkles,
} from "lucide-react";
import { API_URL } from "../context/AuthContext";

function ContactModal({ isOpen, onClose, contact, onSave }) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState("");
  const [category, setCategory] = useState("Other");
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState("");

  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const isEditing = Boolean(contact);

  useEffect(() => {
    if (contact) {
      setName(contact.name || "");
      setPhone(contact.phone || "");
      setEmail(contact.email || "");
      setAddress(contact.address || "");
      setNotes(contact.notes || "");
      setCategory(contact.category || "Other");
      setAvatarPreview(contact.avatar ? `${API_URL}${contact.avatar}` : "");
      setAvatarFile(null);
    } else {
      setName("");
      setPhone("");
      setEmail("");
      setAddress("");
      setNotes("");
      setCategory("Other");
      setAvatarPreview("");
      setAvatarFile(null);
    }
    setError("");
  }, [contact, isOpen]);

  if (!isOpen) return null;

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        setError("Please select a valid image file.");
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        setError("Image must be smaller than 5MB.");
        return;
      }
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
      setError("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!name.trim() || !phone.trim()) {
      setError("Name and Phone number are required fields.");
      return;
    }

    setSaving(true);

    try {
      const formData = new FormData();
      formData.append("name", name.trim());
      formData.append("phone", phone.trim());
      formData.append("email", email.trim());
      formData.append("address", address.trim());
      formData.append("notes", notes.trim());
      formData.append("category", category);

      if (avatarFile) {
        formData.append("avatar", avatarFile);
      }

      const url = isEditing
        ? `${API_URL}/api/contacts/${contact._id}`
        : `${API_URL}/api/contacts`;

      const method = isEditing ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        credentials: "include",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to save contact");
      }

      onSave(data.contact, isEditing);
      onClose();
    } catch (err) {
      setError(err.message || "An error occurred while saving.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-purple-950/40 p-4 backdrop-blur-md">
      <div className="w-full max-w-xl rounded-3xl border border-purple-100 bg-white shadow-2xl max-h-[90vh] flex flex-col overflow-hidden text-slate-800">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-purple-100 px-6 py-4">
          <div className="flex items-center gap-2">
            <Sparkles size={18} className="text-purple-600" />
            <h2 className="text-lg font-extrabold text-purple-950">
              {isEditing ? "Edit Contact Details" : "Add New Contact"}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="rounded-2xl p-1.5 text-slate-400 hover:bg-purple-50 hover:text-purple-900 transition"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">
          {error && (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-3.5 text-xs font-semibold text-red-700">
              {error}
            </div>
          )}

          {/* Avatar Upload Box */}
          <div className="flex items-center gap-4 py-2 border-b border-purple-100 pb-4">
            <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl border border-purple-100 bg-gradient-to-br from-purple-100 to-emerald-100 overflow-hidden ring-4 ring-purple-50 shadow-md">
              {avatarPreview ? (
                <img
                  src={avatarPreview}
                  alt="Avatar preview"
                  className="h-full w-full object-cover"
                />
              ) : (
                <User size={28} className="text-purple-700" />
              )}
            </div>
            <div>
              <label className="inline-flex cursor-pointer items-center gap-2 rounded-2xl border border-purple-200 bg-purple-50/80 px-4 py-2 text-xs font-bold text-purple-900 hover:bg-purple-100 hover:border-purple-300 transition">
                <Upload size={14} className="text-purple-600" />
                <span>{avatarPreview ? "Change Photo" : "Upload Photo"}</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
              <p className="mt-1 text-[11px] font-medium text-slate-400">
                PNG, JPG or WEBP (max 5MB)
              </p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {/* Name */}
            <div>
              <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-purple-900">
                Full Name <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-purple-400">
                  <User size={15} />
                </div>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Full name"
                  required
                  className="w-full rounded-2xl border border-purple-100 bg-purple-50/40 py-2.5 pl-9 pr-3 text-sm font-medium text-slate-800 placeholder-purple-300 outline-none transition focus:border-purple-400 focus:bg-white focus:ring-4 focus:ring-purple-100"
                />
              </div>
            </div>

            {/* Phone */}
            <div>
              <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-purple-900">
                Phone Number <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-purple-400">
                  <Phone size={15} />
                </div>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+1 (555) 000-0000"
                  required
                  className="w-full rounded-2xl border border-purple-100 bg-purple-50/40 py-2.5 pl-9 pr-3 text-sm font-medium text-slate-800 placeholder-purple-300 outline-none transition focus:border-purple-400 focus:bg-white focus:ring-4 focus:ring-purple-100"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-purple-900">
                Email Address
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-purple-400">
                  <Mail size={15} />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="example@domain.com"
                  className="w-full rounded-2xl border border-purple-100 bg-purple-50/40 py-2.5 pl-9 pr-3 text-sm font-medium text-slate-800 placeholder-purple-300 outline-none transition focus:border-purple-400 focus:bg-white focus:ring-4 focus:ring-purple-100"
                />
              </div>
            </div>

            {/* Category */}
            <div>
              <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-purple-900">
                Category Tag
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-purple-400">
                  <Tag size={15} />
                </div>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full rounded-2xl border border-purple-100 bg-purple-50/40 py-2.5 pl-9 pr-3 text-sm font-bold text-purple-950 outline-none transition focus:border-purple-400 focus:bg-white focus:ring-4 focus:ring-purple-100"
                >
                  <option value="Family">Family</option>
                  <option value="Friend">Friend</option>
                  <option value="Work">Work</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>
          </div>

          {/* Address */}
          <div>
            <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-purple-900">
              Address
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-emerald-500">
                <MapPin size={15} />
              </div>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="City, Country"
                className="w-full rounded-2xl border border-purple-100 bg-purple-50/40 py-2.5 pl-9 pr-3 text-sm font-medium text-slate-800 placeholder-purple-300 outline-none transition focus:border-purple-400 focus:bg-white focus:ring-4 focus:ring-purple-100"
              />
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-purple-900">
              Notes
            </label>
            <div className="relative">
              <textarea
                rows="3"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add relevant contact notes..."
                className="w-full resize-none rounded-2xl border border-purple-100 bg-purple-50/40 p-3 text-sm font-medium text-slate-800 placeholder-purple-300 outline-none transition focus:border-purple-400 focus:bg-white focus:ring-4 focus:ring-purple-100"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 border-t border-purple-100 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 px-5 py-2 text-xs font-bold text-white shadow-lg shadow-purple-200 hover:from-purple-700 hover:to-indigo-700 transition disabled:opacity-50"
            >
              {saving ? "Saving..." : isEditing ? "Update Contact" : "Add Contact"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ContactModal;

