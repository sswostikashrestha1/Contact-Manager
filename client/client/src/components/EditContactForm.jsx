import { useState } from "react";
import {
  User,
  Phone,
  Mail,
  MapPin,
  StickyNote,
  Tag,
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
    <div className="mt-5 rounded-xl border border-gray-200 bg-gray-50 p-5">

      {/* Header */}
      <div className="mb-5">
        <h3 className="text-lg font-semibold text-gray-900">
          Edit Contact
        </h3>

        <p className="mt-1 text-sm text-gray-500">
          Update the contact information below.
        </p>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>

        <div className="grid gap-5 sm:grid-cols-2">

          {/* Name */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <User size={16} />
              Name *
            </label>

            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="mt-2 w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-gray-400 focus:ring-2 focus:ring-gray-100"
            />
          </div>

          {/* Phone */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <Phone size={16} />
              Phone *
            </label>

            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
              className="mt-2 w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-gray-400 focus:ring-2 focus:ring-gray-100"
            />
          </div>

          {/* Email */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <Mail size={16} />
              Email
            </label>

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-2 w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-gray-400 focus:ring-2 focus:ring-gray-100"
            />
          </div>

          {/* Category */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <Tag size={16} />
              Category
            </label>

            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="mt-2 w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-gray-400 focus:ring-2 focus:ring-gray-100"
            >
              <option value="">Select category</option>
              <option value="Family">Family</option>
              <option value="Friend">Friend</option>
              <option value="Work">Work</option>
            </select>
          </div>

          {/* Address */}
          <div className="sm:col-span-2">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <MapPin size={16} />
              Address
            </label>

            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="mt-2 w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-gray-400 focus:ring-2 focus:ring-gray-100"
            />
          </div>

          {/* Notes */}
          <div className="sm:col-span-2">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <StickyNote size={16} />
              Notes
            </label>

            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows="3"
              className="mt-2 w-full resize-none rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-gray-400 focus:ring-2 focus:ring-gray-100"
            />
          </div>

        </div>

        {/* Buttons */}
        <div className="mt-6 flex justify-end gap-3 border-t border-gray-200 pt-5">

          <button
            type="button"
            onClick={onCancel}
            disabled={saving}
            className="rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={saving}
            className="rounded-lg bg-gray-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {saving ? "Updating..." : "Update Contact"}
          </button>

        </div>

      </form>
    </div>
  );
}

export default EditContactForm;