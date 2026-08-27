import { useState } from "react";
import {
  User,
  Phone,
  Mail,
  MapPin,
  StickyNote,
  Tag,
  Pencil,
} from "lucide-react";

function EditContactForm({
  contact,
  onContactUpdated,
  onCancel,
}) {
  const [name, setName] = useState(contact.name);
  const [phone, setPhone] = useState(contact.phone);
  const [email, setEmail] = useState(contact.email || "");
  const [address, setAddress] = useState(contact.address || "");
  const [notes, setNotes] = useState(contact.notes || "");
  const [category, setCategory] = useState(contact.category || "");

  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();

    setError("");

    if (!name || !phone) {
      setError("Name and phone are required.");
      return;
    }

    setSaving(true);

    try {
      const response = await fetch(
        `http://localhost:5000/api/contacts/${contact._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            name,
            phone,
            email,
            address,
            notes,
            category,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to update contact"
        );
      }

      onContactUpdated(data.contact);
    } catch (error) {
      console.log(error);
      setError(error.message);
    }

    setSaving(false);
  }

  return (
    <div className="rounded-3xl border border-purple-100 bg-white p-6 text-slate-800 backdrop-blur-xl shadow-xl shadow-purple-900/5">

      {/* Header */}
      <div className="mb-5 flex items-center justify-between border-b border-purple-100 pb-4">
        <div>
          <h3 className="text-lg font-extrabold text-purple-950 flex items-center gap-2">
            <Pencil size={18} className="text-purple-600" />
            Edit Contact Details
          </h3>
          <p className="mt-1 text-xs font-medium text-slate-500">
            Update contact information below.
          </p>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-xs font-semibold text-red-700">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">

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
                className="w-full rounded-2xl border border-purple-100 bg-purple-50/40 py-2.5 pl-9 pr-3 text-sm font-medium text-slate-800 placeholder-purple-300 outline-none transition focus:border-purple-400 focus:bg-white focus:ring-4 focus:ring-purple-100"
              />
            </div>
          </div>

          {/* Category */}
          <div>
            <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-purple-900">
              Category
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
                <option value="">Select category</option>
                <option value="Family">Family</option>
                <option value="Friend">Friend</option>
                <option value="Work">Work</option>
              </select>
            </div>
          </div>

          {/* Address */}
          <div className="sm:col-span-2">
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
                className="w-full rounded-2xl border border-purple-100 bg-purple-50/40 py-2.5 pl-9 pr-3 text-sm font-medium text-slate-800 placeholder-purple-300 outline-none transition focus:border-purple-400 focus:bg-white focus:ring-4 focus:ring-purple-100"
              />
            </div>
          </div>

          {/* Notes */}
          <div className="sm:col-span-2">
            <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-purple-900">
              Notes
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows="3"
              className="w-full resize-none rounded-2xl border border-purple-100 bg-purple-50/40 p-3 text-sm font-medium text-slate-800 placeholder-purple-300 outline-none transition focus:border-purple-400 focus:bg-white focus:ring-4 focus:ring-purple-100"
            />
          </div>

        </div>

        {/* Buttons */}
        <div className="mt-6 flex justify-end gap-3 border-t border-purple-100 pt-5">
          <button
            type="button"
            onClick={onCancel}
            disabled={saving}
            className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 transition"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={saving}
            className="rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 px-5 py-2 text-xs font-bold text-white shadow-lg shadow-purple-200 hover:from-purple-700 hover:to-indigo-700 transition disabled:opacity-50"
          >
            {saving ? "Updating..." : "Update Contact"}
          </button>
        </div>

      </form>
    </div>
  );
}

export default EditContactForm;