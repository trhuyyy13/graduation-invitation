"use client";

import { useEffect, useMemo, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import {
  attendanceOptions,
  getAttendanceLabel,
  type AttendanceStatus,
} from "@/lib/attendance";

type Guest = {
  id: number;
  slug: string;
  name: string;
  displayName: string;
  salutation: string;
  selfRef: string;
  active: boolean;
};

type StoredMessage = {
  id: number;
  slug: string;
  name: string;
  message: string;
  attendance: AttendanceStatus | null;
  submittedAt: string;
};

type EventSettingsForm = {
  date: string;
  startTime: string;
  endTime: string;
  venue: string;
  university: string;
  address: string;
  contactPhone: string;
  contactPhone2: string;
};

const GUESTS_PER_PAGE = 10;
const MESSAGES_PER_PAGE = 10;

const emptyForm = { slug: "", name: "", displayName: "", salutation: "", selfRef: "" };
const emptyEventSettings: EventSettingsForm = {
  date: "",
  startTime: "",
  endTime: "",
  venue: "",
  university: "",
  address: "",
  contactPhone: "",
  contactPhone2: "",
};

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleString("vi-VN");
  } catch {
    return iso;
  }
}

export default function AdminPage() {
  const router = useRouter();
  const [guests, setGuests] = useState<Guest[]>([]);
  const [messages, setMessages] = useState<StoredMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [origin, setOrigin] = useState("");
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null);

  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState(emptyForm);
  const [editError, setEditError] = useState<string | null>(null);

  const [addGuestError, setAddGuestError] = useState<string | null>(null);

  const [newGuest, setNewGuest] = useState(emptyForm);
  const [addingGuest, setAddingGuest] = useState(false);

  const [eventSettings, setEventSettings] = useState<EventSettingsForm>(emptyEventSettings);
  const [savingEventSettings, setSavingEventSettings] = useState(false);
  const [eventSettingsSaved, setEventSettingsSaved] = useState(false);
  const [attendanceTab, setAttendanceTab] = useState<AttendanceStatus | "all">("all");

  const [guestSearch, setGuestSearch] = useState("");
  const [guestPage, setGuestPage] = useState(1);
  const [messagePage, setMessagePage] = useState(1);

  const filteredGuests = useMemo(() => {
    const q = guestSearch.trim().toLowerCase();
    if (!q) return guests;
    return guests.filter((guest) =>
      [guest.name, guest.displayName, guest.slug].some((field) =>
        field.toLowerCase().includes(q)
      )
    );
  }, [guests, guestSearch]);

  const guestTotalPages = Math.max(1, Math.ceil(filteredGuests.length / GUESTS_PER_PAGE));
  const pagedGuests = filteredGuests.slice(
    (guestPage - 1) * GUESTS_PER_PAGE,
    guestPage * GUESTS_PER_PAGE
  );

  useEffect(() => {
    setGuestPage(1);
  }, [guestSearch]);

  useEffect(() => {
    setGuestPage((p) => Math.min(p, guestTotalPages));
  }, [guestTotalPages]);

  const messageTotalPages = Math.max(1, Math.ceil(messages.length / MESSAGES_PER_PAGE));
  const pagedMessages = messages.slice(
    (messagePage - 1) * MESSAGES_PER_PAGE,
    messagePage * MESSAGES_PER_PAGE
  );

  useEffect(() => {
    setMessagePage((p) => Math.min(p, messageTotalPages));
  }, [messageTotalPages]);

  const attendanceResponses = useMemo(() => {
    const guestsBySlug = new Map(guests.map((guest) => [guest.slug, guest]));

    return messages
      .filter((message) => message.attendance)
      .map((message) => {
        const guest = message.slug ? guestsBySlug.get(message.slug) : undefined;
        return {
          ...message,
          guestId: guest?.id ?? null,
          resolvedName: guest
            ? `${guest.displayName} (${guest.name})`
            : message.name || "Khách chưa có link riêng",
        };
      });
  }, [guests, messages]);

  const visibleAttendanceResponses = attendanceResponses.filter(
    (response) => attendanceTab === "all" || response.attendance === attendanceTab
  );

  useEffect(() => {
    setOrigin(window.location.origin);
    void loadData();
  }, []);

  // silent=true is used to refresh data after an edit without tearing down
  // and rebuilding the whole page (which caused a jarring flash/scroll jump).
  async function loadData({ silent = false }: { silent?: boolean } = {}) {
    if (!silent) setLoading(true);
    const res = await fetch("/api/admin/data");
    if (res.ok) {
      const data = await res.json();
      setGuests(data.guests);
      setMessages(data.messages);
      if (data.eventSettings) {
        const s = data.eventSettings;
        setEventSettings({
          date: s.date,
          startTime: s.startTime,
          endTime: s.endTime,
          venue: s.venue,
          university: s.university,
          address: s.address,
          contactPhone: s.contactPhone,
          contactPhone2: s.contactPhone2 ?? "",
        });
      }
    }
    if (!silent) setLoading(false);
  }

  async function handleSaveEventSettings(event: FormEvent) {
    event.preventDefault();
    setSavingEventSettings(true);
    setEventSettingsSaved(false);
    const res = await fetch("/api/admin/event-settings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(eventSettings),
    });
    setSavingEventSettings(false);
    if (res.ok) {
      setEventSettingsSaved(true);
      setTimeout(() => setEventSettingsSaved(false), 2000);
    }
  }

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
  }

  async function handleAddGuest(event: FormEvent) {
    event.preventDefault();
    if (!newGuest.name.trim() || !newGuest.displayName.trim()) return;

    setAddingGuest(true);
    setAddGuestError(null);
    const res = await fetch("/api/admin/guests", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newGuest),
    });
    setAddingGuest(false);

    if (res.ok) {
      setNewGuest(emptyForm);
      void loadData({ silent: true });
    } else {
      const data = await res.json().catch(() => null);
      setAddGuestError(data?.error ?? "Có lỗi xảy ra, thử lại nhé.");
    }
  }

  function startEdit(guest: Guest) {
    setEditingId(guest.id);
    setEditError(null);
    setEditForm({
      slug: guest.slug,
      name: guest.name,
      displayName: guest.displayName,
      salutation: guest.salutation,
      selfRef: guest.selfRef,
    });
  }

  async function saveEdit(id: number) {
    setEditError(null);
    const res = await fetch(`/api/admin/guests/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editForm),
    });
    if (res.ok) {
      setEditingId(null);
      void loadData({ silent: true });
    } else {
      const data = await res.json().catch(() => null);
      setEditError(data?.error ?? "Có lỗi xảy ra, thử lại nhé.");
    }
  }

  async function toggleActive(guest: Guest) {
    const nextActive = !guest.active;
    setGuests((list) =>
      list.map((g) => (g.id === guest.id ? { ...g, active: nextActive } : g))
    );
    const res = await fetch(`/api/admin/guests/${guest.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ active: nextActive }),
    });
    if (!res.ok) {
      // revert on failure
      setGuests((list) =>
        list.map((g) => (g.id === guest.id ? { ...g, active: guest.active } : g))
      );
    }
  }

  async function copyLink(slug: string) {
    const link = `${origin}/${slug}`;
    try {
      await navigator.clipboard.writeText(link);
      setCopiedSlug(slug);
      setTimeout(() => setCopiedSlug((s) => (s === slug ? null : s)), 1500);
    } catch {
      // clipboard unavailable — user can still select the text field manually
    }
  }

  async function deleteMessage(id: number) {
    const previous = messages;
    setMessages((list) => list.filter((m) => m.id !== id));
    const res = await fetch(`/api/admin/messages/${id}`, { method: "DELETE" });
    if (!res.ok) {
      // revert on failure
      setMessages(previous);
    }
  }

  return (
    <div className="min-h-svh bg-[#f6efe3] px-4 py-8 sm:px-8">
      <div className="mx-auto max-w-3xl">
        <div className="flex items-center justify-between">
          <h1 className="font-serif text-2xl font-semibold text-maroon sm:text-3xl">
            Quản trị lời mời
          </h1>
          <button
            onClick={handleLogout}
            className="focus-ring rounded-full border border-maroon/30 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-maroon transition-colors hover:bg-maroon hover:text-warm-white"
          >
            Đăng xuất
          </button>
        </div>

        {loading ? (
          <p className="mt-8 text-sm text-[#6b6058]">Đang tải...</p>
        ) : (
          <>
            {/* Event settings */}
            <section className="mt-8 rounded-2xl bg-white p-5 shadow-[0_10px_24px_rgba(60,20,10,0.08)] sm:p-6">
              <h2 className="font-serif text-lg font-semibold text-[#452420]">
                Thông tin sự kiện
              </h2>

              <form
                onSubmit={handleSaveEventSettings}
                className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2"
              >
                <label className="flex flex-col gap-1 text-xs font-semibold text-[#6b6058]">
                  Ngày tổ chức
                  <input
                    required
                    type="date"
                    value={eventSettings.date}
                    onChange={(e) =>
                      setEventSettings((f) => ({ ...f, date: e.target.value }))
                    }
                    className="focus-ring rounded-lg border border-[#d8bf8e] p-2 text-sm font-normal text-[#2b2320]"
                  />
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <label className="flex flex-col gap-1 text-xs font-semibold text-[#6b6058]">
                    Giờ bắt đầu
                    <input
                      required
                      type="time"
                      value={eventSettings.startTime}
                      onChange={(e) =>
                        setEventSettings((f) => ({ ...f, startTime: e.target.value }))
                      }
                      className="focus-ring rounded-lg border border-[#d8bf8e] p-2 text-sm font-normal text-[#2b2320]"
                    />
                  </label>
                  <label className="flex flex-col gap-1 text-xs font-semibold text-[#6b6058]">
                    Giờ kết thúc
                    <input
                      required
                      type="time"
                      value={eventSettings.endTime}
                      onChange={(e) =>
                        setEventSettings((f) => ({ ...f, endTime: e.target.value }))
                      }
                      className="focus-ring rounded-lg border border-[#d8bf8e] p-2 text-sm font-normal text-[#2b2320]"
                    />
                  </label>
                </div>
                <label className="flex flex-col gap-1 text-xs font-semibold text-[#6b6058]">
                  Địa điểm (hội trường)
                  <input
                    required
                    value={eventSettings.venue}
                    onChange={(e) =>
                      setEventSettings((f) => ({ ...f, venue: e.target.value }))
                    }
                    className="focus-ring rounded-lg border border-[#d8bf8e] p-2 text-sm font-normal text-[#2b2320]"
                  />
                </label>
                <label className="flex flex-col gap-1 text-xs font-semibold text-[#6b6058]">
                  Trường / cơ sở
                  <input
                    required
                    value={eventSettings.university}
                    onChange={(e) =>
                      setEventSettings((f) => ({ ...f, university: e.target.value }))
                    }
                    className="focus-ring rounded-lg border border-[#d8bf8e] p-2 text-sm font-normal text-[#2b2320]"
                  />
                </label>
                <label className="flex flex-col gap-1 text-xs font-semibold text-[#6b6058] sm:col-span-2">
                  Địa chỉ chi tiết
                  <input
                    required
                    value={eventSettings.address}
                    onChange={(e) =>
                      setEventSettings((f) => ({ ...f, address: e.target.value }))
                    }
                    className="focus-ring rounded-lg border border-[#d8bf8e] p-2 text-sm font-normal text-[#2b2320]"
                  />
                </label>
                <label className="flex flex-col gap-1 text-xs font-semibold text-[#6b6058]">
                  Số điện thoại liên hệ
                  <input
                    required
                    placeholder="VD: 0865505899 (Huy)"
                    value={eventSettings.contactPhone}
                    onChange={(e) =>
                      setEventSettings((f) => ({ ...f, contactPhone: e.target.value }))
                    }
                    className="focus-ring rounded-lg border border-[#d8bf8e] p-2 text-sm font-normal text-[#2b2320]"
                  />
                </label>
                <label className="flex flex-col gap-1 text-xs font-semibold text-[#6b6058]">
                  Số điện thoại liên hệ (thêm, không bắt buộc)
                  <input
                    placeholder="VD: 0123456789 (Đông)"
                    value={eventSettings.contactPhone2}
                    onChange={(e) =>
                      setEventSettings((f) => ({ ...f, contactPhone2: e.target.value }))
                    }
                    className="focus-ring rounded-lg border border-[#d8bf8e] p-2 text-sm font-normal text-[#2b2320]"
                  />
                </label>

                <div className="flex items-center gap-3 sm:col-span-2">
                  <button
                    type="submit"
                    disabled={savingEventSettings}
                    className="focus-ring mt-1 inline-flex min-h-[42px] items-center justify-center rounded-full bg-[#5c0c0d] px-6 text-xs font-semibold uppercase tracking-[0.3em] text-warm-white hover:bg-[#4c0709] disabled:opacity-60"
                  >
                    {savingEventSettings ? "Đang lưu..." : "Lưu thông tin"}
                  </button>
                  {eventSettingsSaved && (
                    <span className="text-xs font-semibold text-green-700">Đã lưu!</span>
                  )}
                </div>
              </form>
            </section>

            {/* Guests */}
            <section className="mt-8 rounded-2xl bg-white p-5 shadow-[0_10px_24px_rgba(60,20,10,0.08)] sm:p-6">
              <h2 className="font-serif text-lg font-semibold text-[#452420]">
                Khách mời ({guests.length})
              </h2>

              <input
                value={guestSearch}
                onChange={(e) => setGuestSearch(e.target.value)}
                placeholder="Tìm khách theo tên, tên hiển thị hoặc link..."
                className="focus-ring mt-3 w-full rounded-lg border border-[#d8bf8e] p-2 text-sm font-normal text-[#2b2320]"
              />

              <div className="mt-4 flex flex-col gap-3">
                {pagedGuests.length === 0 && (
                  <p className="text-sm text-[#6b6058]">
                    {guestSearch ? "Không tìm thấy khách nào." : "Chưa có khách mời nào."}
                  </p>
                )}
                {pagedGuests.map((guest) => (
                  <div
                    key={guest.id}
                    className="rounded-xl border border-[#e7d3ad] bg-[#fffdf9] p-4"
                  >
                    {editingId === guest.id ? (
                      <div className="flex flex-col gap-2">
                        <div className="grid grid-cols-2 gap-2">
                          <label className="col-span-2 flex flex-col gap-1 text-xs font-semibold text-[#6b6058]">
                            Đường link riêng (URL) — vd: {origin}/
                            <input
                              value={editForm.slug}
                              onChange={(e) =>
                                setEditForm((f) => ({ ...f, slug: e.target.value }))
                              }
                              placeholder="anh-minh"
                              className="focus-ring rounded-lg border border-[#d8bf8e] p-2 text-sm font-normal text-[#2b2320]"
                            />
                          </label>
                          <input
                            value={editForm.name}
                            onChange={(e) =>
                              setEditForm((f) => ({ ...f, name: e.target.value }))
                            }
                            placeholder="Tên đầy đủ"
                            className="focus-ring rounded-lg border border-[#d8bf8e] p-2 text-sm"
                          />
                          <input
                            value={editForm.displayName}
                            onChange={(e) =>
                              setEditForm((f) => ({ ...f, displayName: e.target.value }))
                            }
                            placeholder="Tên hiển thị"
                            className="focus-ring rounded-lg border border-[#d8bf8e] p-2 text-sm"
                          />
                          <input
                            value={editForm.salutation}
                            onChange={(e) =>
                              setEditForm((f) => ({ ...f, salutation: e.target.value }))
                            }
                            placeholder='Huy gọi khách là gì (VD "Anh")'
                            className="focus-ring rounded-lg border border-[#d8bf8e] p-2 text-sm"
                          />
                          <input
                            value={editForm.selfRef}
                            onChange={(e) =>
                              setEditForm((f) => ({ ...f, selfRef: e.target.value }))
                            }
                            placeholder='Huy tự xưng là gì (VD "em")'
                            className="focus-ring rounded-lg border border-[#d8bf8e] p-2 text-sm"
                          />
                        </div>
                        {editError && <p className="text-xs text-maroon">{editError}</p>}
                        <div className="mt-1 flex gap-2">
                          <button
                            onClick={() => saveEdit(guest.id)}
                            className="focus-ring rounded-full bg-[#5c0c0d] px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-warm-white hover:bg-[#4c0709]"
                          >
                            Lưu
                          </button>
                          <button
                            onClick={() => {
                              setEditingId(null);
                              setEditError(null);
                            }}
                            className="focus-ring rounded-full border border-[#d8bf8e] px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-[#6b6058]"
                          >
                            Hủy
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div>
                          <p className="font-medium text-[#2b2320]">
                            {guest.displayName}{" "}
                            <span className="text-xs font-normal text-[#9b774d]">
                              ({guest.name})
                            </span>
                            {!guest.active && (
                              <span className="ml-2 rounded-full bg-[#eee] px-2 py-0.5 text-[0.65rem] uppercase text-[#999]">
                                Đã tắt
                              </span>
                            )}
                          </p>
                          <p className="text-xs text-[#6b6058]">
                            Huy gọi &quot;{guest.salutation}&quot; · tự xưng &quot;
                            {guest.selfRef}&quot;
                          </p>
                        </div>

                        <div className="flex flex-wrap items-center gap-2">
                          <code className="rounded-md bg-[#f6efe3] px-2 py-1 text-xs text-[#4d4038]">
                            {origin}/{guest.slug}
                          </code>
                          <button
                            onClick={() => copyLink(guest.slug)}
                            className="focus-ring rounded-full border border-maroon/30 px-3 py-1.5 text-xs font-semibold text-maroon hover:bg-maroon hover:text-warm-white"
                          >
                            {copiedSlug === guest.slug ? "Đã copy!" : "Copy link"}
                          </button>
                          <button
                            onClick={() => startEdit(guest)}
                            className="focus-ring rounded-full border border-[#d8bf8e] px-3 py-1.5 text-xs font-semibold text-[#6b6058] hover:border-maroon hover:text-maroon"
                          >
                            Sửa
                          </button>
                          <button
                            onClick={() => toggleActive(guest)}
                            className="focus-ring rounded-full border border-[#d8bf8e] px-3 py-1.5 text-xs font-semibold text-[#6b6058] hover:border-maroon hover:text-maroon"
                          >
                            {guest.active ? "Tắt link" : "Bật link"}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {guestTotalPages > 1 && (
                <div className="mt-4 flex items-center justify-center gap-3">
                  <button
                    type="button"
                    onClick={() => setGuestPage((p) => Math.max(1, p - 1))}
                    disabled={guestPage <= 1}
                    className="focus-ring rounded-full border border-[#d8bf8e] px-3 py-1.5 text-xs font-semibold text-[#6b6058] hover:border-maroon hover:text-maroon disabled:opacity-40"
                  >
                    Trước
                  </button>
                  <span className="text-xs text-[#6b6058]">
                    Trang {guestPage}/{guestTotalPages}
                  </span>
                  <button
                    type="button"
                    onClick={() => setGuestPage((p) => Math.min(guestTotalPages, p + 1))}
                    disabled={guestPage >= guestTotalPages}
                    className="focus-ring rounded-full border border-[#d8bf8e] px-3 py-1.5 text-xs font-semibold text-[#6b6058] hover:border-maroon hover:text-maroon disabled:opacity-40"
                  >
                    Sau
                  </button>
                </div>
              )}

              <form
                onSubmit={handleAddGuest}
                className="mt-5 grid grid-cols-1 gap-2 border-t border-[#eee] pt-5 sm:grid-cols-2"
              >
                <label className="flex flex-col gap-1 text-xs font-semibold text-[#6b6058] sm:col-span-2">
                  Đường link riêng (URL) — vd: {origin}/
                  <input
                    value={newGuest.slug}
                    onChange={(e) => setNewGuest((f) => ({ ...f, slug: e.target.value }))}
                    placeholder="anh-minh (để trống sẽ tự tạo từ tên hiển thị)"
                    className="focus-ring rounded-lg border border-[#d8bf8e] p-2 text-sm font-normal text-[#2b2320]"
                  />
                </label>
                <input
                  required
                  value={newGuest.name}
                  onChange={(e) => setNewGuest((f) => ({ ...f, name: e.target.value }))}
                  placeholder="Tên đầy đủ *"
                  className="focus-ring rounded-lg border border-[#d8bf8e] p-2 text-sm"
                />
                <input
                  required
                  value={newGuest.displayName}
                  onChange={(e) =>
                    setNewGuest((f) => ({ ...f, displayName: e.target.value }))
                  }
                  placeholder="Tên hiển thị *"
                  className="focus-ring rounded-lg border border-[#d8bf8e] p-2 text-sm"
                />
                <input
                  value={newGuest.salutation}
                  onChange={(e) =>
                    setNewGuest((f) => ({ ...f, salutation: e.target.value }))
                  }
                  placeholder='Huy gọi khách là gì (VD "Anh")'
                  className="focus-ring rounded-lg border border-[#d8bf8e] p-2 text-sm"
                />
                <input
                  value={newGuest.selfRef}
                  onChange={(e) => setNewGuest((f) => ({ ...f, selfRef: e.target.value }))}
                  placeholder='Huy tự xưng là gì (VD "em")'
                  className="focus-ring rounded-lg border border-[#d8bf8e] p-2 text-sm"
                />
                {addGuestError && (
                  <p className="text-xs text-maroon sm:col-span-2">{addGuestError}</p>
                )}
                <button
                  type="submit"
                  disabled={addingGuest}
                  className="focus-ring col-span-1 mt-1 inline-flex min-h-[42px] items-center justify-center rounded-full bg-[#5c0c0d] px-6 text-xs font-semibold uppercase tracking-[0.3em] text-warm-white hover:bg-[#4c0709] disabled:opacity-60 sm:col-span-2"
                >
                  {addingGuest ? "Đang thêm..." : "+ Thêm khách mời"}
                </button>
              </form>
            </section>

            {/* Messages */}
            <section className="mt-6 rounded-2xl bg-white p-5 shadow-[0_10px_24px_rgba(60,20,10,0.08)] sm:p-6">
              <h2 className="font-serif text-lg font-semibold text-[#452420]">
                Lưu bút ({messages.length})
              </h2>

              {messages.length === 0 ? (
                <p className="mt-3 text-sm text-[#6b6058]">Chưa có lưu bút nào.</p>
              ) : (
                <div className="mt-4 flex flex-col gap-3">
                  {pagedMessages.map((msg) => (
                    <div
                      key={msg.id}
                      className="rounded-xl border border-[#e7d3ad] bg-[#fffdf9] p-4"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="font-medium text-[#2b2320]">{msg.name}</p>
                          <p className="text-xs text-[#9b774d]">
                            {formatDate(msg.submittedAt)}
                            {msg.slug && ` · slug ${msg.slug}`}
                          </p>
                          {msg.attendance && (
                            <p className="mt-1 text-xs font-semibold text-maroon">
                              {getAttendanceLabel(msg.attendance)}
                            </p>
                          )}
                        </div>
                        <button
                          onClick={() => deleteMessage(msg.id)}
                          className="focus-ring shrink-0 rounded-full border border-[#d8bf8e] px-3 py-1 text-xs font-semibold text-[#6b6058] hover:border-maroon hover:text-maroon"
                        >
                          Xóa
                        </button>
                      </div>
                      <p className="mt-2 whitespace-pre-line text-sm text-[#4d4038]">
                        {msg.message}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              {messageTotalPages > 1 && (
                <div className="mt-4 flex items-center justify-center gap-3">
                  <button
                    type="button"
                    onClick={() => setMessagePage((p) => Math.max(1, p - 1))}
                    disabled={messagePage <= 1}
                    className="focus-ring rounded-full border border-[#d8bf8e] px-3 py-1.5 text-xs font-semibold text-[#6b6058] hover:border-maroon hover:text-maroon disabled:opacity-40"
                  >
                    Trước
                  </button>
                  <span className="text-xs text-[#6b6058]">
                    Trang {messagePage}/{messageTotalPages}
                  </span>
                  <button
                    type="button"
                    onClick={() => setMessagePage((p) => Math.min(messageTotalPages, p + 1))}
                    disabled={messagePage >= messageTotalPages}
                    className="focus-ring rounded-full border border-[#d8bf8e] px-3 py-1.5 text-xs font-semibold text-[#6b6058] hover:border-maroon hover:text-maroon disabled:opacity-40"
                  >
                    Sau
                  </button>
                </div>
              )}
            </section>

            {/* Attendance votes */}
            <section className="mt-6 rounded-2xl bg-white p-5 shadow-[0_10px_24px_rgba(60,20,10,0.08)] sm:p-6">
              <h2 className="font-serif text-lg font-semibold text-[#452420]">
                Phản hồi tham dự ({attendanceResponses.length})
              </h2>

              <div className="mt-4 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setAttendanceTab("all")}
                  className={`focus-ring rounded-full px-3 py-1.5 text-xs font-semibold uppercase tracking-wide ${
                    attendanceTab === "all"
                      ? "bg-[#5c0c0d] text-warm-white"
                      : "border border-[#d8bf8e] text-[#6b6058] hover:border-maroon hover:text-maroon"
                  }`}
                >
                  Tất cả ({attendanceResponses.length})
                </button>
                {attendanceOptions.map((option) => {
                  const count = attendanceResponses.filter(
                    (response) => response.attendance === option.value
                  ).length;
                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setAttendanceTab(option.value)}
                      className={`focus-ring rounded-full px-3 py-1.5 text-xs font-semibold uppercase tracking-wide ${
                        attendanceTab === option.value
                          ? "bg-[#5c0c0d] text-warm-white"
                          : "border border-[#d8bf8e] text-[#6b6058] hover:border-maroon hover:text-maroon"
                      }`}
                    >
                      {option.adminLabel} ({count})
                    </button>
                  );
                })}
              </div>

              {visibleAttendanceResponses.length === 0 ? (
                <p className="mt-4 text-sm text-[#6b6058]">Chưa có phản hồi trong tab này.</p>
              ) : (
                <div className="mt-4 flex flex-col gap-2">
                  {visibleAttendanceResponses.map((response) => (
                    <div
                      key={response.id}
                      className="rounded-xl border border-[#e7d3ad] bg-[#fffdf9] p-4"
                    >
                      <div className="flex flex-wrap items-start justify-between gap-2">
                        <div>
                          <p className="font-medium text-[#2b2320]">
                            {response.resolvedName}
                          </p>
                          <p className="text-xs text-[#9b774d]">
                            {response.guestId ? `ID ${response.guestId}` : "Không có ID"}
                            {response.slug ? ` · slug ${response.slug}` : " · không có slug"}
                            {" · "}
                            {formatDate(response.submittedAt)}
                          </p>
                        </div>
                        {response.attendance && (
                          <span className="rounded-full bg-[#f6efe3] px-3 py-1 text-xs font-semibold text-maroon">
                            {getAttendanceLabel(response.attendance)}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </>
        )}
      </div>
    </div>
  );
}
