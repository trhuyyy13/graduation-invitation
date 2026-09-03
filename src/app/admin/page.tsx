"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";

type Guest = {
  slug: string;
  name: string;
  displayName: string;
  salutation: string;
  selfRef: string;
  active: boolean;
};

type StoredMessage = {
  index: number;
  slug: string;
  name: string;
  message: string;
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
};

const emptyForm = { name: "", displayName: "", salutation: "", selfRef: "" };
const emptyEventSettings: EventSettingsForm = {
  date: "",
  startTime: "",
  endTime: "",
  venue: "",
  university: "",
  address: "",
  contactPhone: "",
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

  const [editingSlug, setEditingSlug] = useState<string | null>(null);
  const [editForm, setEditForm] = useState(emptyForm);

  const [newGuest, setNewGuest] = useState(emptyForm);
  const [addingGuest, setAddingGuest] = useState(false);

  const [eventSettings, setEventSettings] = useState<EventSettingsForm>(emptyEventSettings);
  const [savingEventSettings, setSavingEventSettings] = useState(false);
  const [eventSettingsSaved, setEventSettingsSaved] = useState(false);

  useEffect(() => {
    setOrigin(window.location.origin);
    void loadData();
  }, []);

  async function loadData() {
    setLoading(true);
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
        });
      }
    }
    setLoading(false);
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
    const res = await fetch("/api/admin/guests", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newGuest),
    });
    setAddingGuest(false);

    if (res.ok) {
      setNewGuest(emptyForm);
      void loadData();
    }
  }

  function startEdit(guest: Guest) {
    setEditingSlug(guest.slug);
    setEditForm({
      name: guest.name,
      displayName: guest.displayName,
      salutation: guest.salutation,
      selfRef: guest.selfRef,
    });
  }

  async function saveEdit(slug: string) {
    await fetch(`/api/admin/guests/${slug}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editForm),
    });
    setEditingSlug(null);
    void loadData();
  }

  async function toggleActive(guest: Guest) {
    await fetch(`/api/admin/guests/${guest.slug}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ active: !guest.active }),
    });
    void loadData();
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

  async function deleteMessage(index: number) {
    await fetch(`/api/admin/messages/${index}`, { method: "DELETE" });
    void loadData();
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
                    value={eventSettings.contactPhone}
                    onChange={(e) =>
                      setEventSettings((f) => ({ ...f, contactPhone: e.target.value }))
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

              <div className="mt-4 flex flex-col gap-3">
                {guests.map((guest) => (
                  <div
                    key={guest.slug}
                    className="rounded-xl border border-[#e7d3ad] bg-[#fffdf9] p-4"
                  >
                    {editingSlug === guest.slug ? (
                      <div className="flex flex-col gap-2">
                        <div className="grid grid-cols-2 gap-2">
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
                        <div className="mt-1 flex gap-2">
                          <button
                            onClick={() => saveEdit(guest.slug)}
                            className="focus-ring rounded-full bg-[#5c0c0d] px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-warm-white hover:bg-[#4c0709]"
                          >
                            Lưu
                          </button>
                          <button
                            onClick={() => setEditingSlug(null)}
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

              <form
                onSubmit={handleAddGuest}
                className="mt-5 grid grid-cols-1 gap-2 border-t border-[#eee] pt-5 sm:grid-cols-2"
              >
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
                Lời nhắn ({messages.length})
              </h2>

              {messages.length === 0 ? (
                <p className="mt-3 text-sm text-[#6b6058]">Chưa có lời nhắn nào.</p>
              ) : (
                <div className="mt-4 flex flex-col gap-3">
                  {messages.map((msg) => (
                    <div
                      key={msg.index}
                      className="rounded-xl border border-[#e7d3ad] bg-[#fffdf9] p-4"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="font-medium text-[#2b2320]">{msg.name}</p>
                          <p className="text-xs text-[#9b774d]">
                            {formatDate(msg.submittedAt)}
                            {msg.slug && ` · slug ${msg.slug}`}
                          </p>
                        </div>
                        <button
                          onClick={() => deleteMessage(msg.index)}
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
            </section>
          </>
        )}
      </div>
    </div>
  );
}
