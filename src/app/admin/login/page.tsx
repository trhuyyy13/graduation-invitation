"use client";

import { Suspense, useState, type FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (!res.ok) {
        setError("Sai mật khẩu, thử lại nhé.");
        setLoading(false);
        return;
      }
      router.push(searchParams.get("from") || "/admin");
      router.refresh();
    } catch {
      setError("Có lỗi xảy ra, thử lại nhé.");
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-svh items-center justify-center bg-[#f6efe3] px-6">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-[340px] rounded-2xl bg-white p-8 shadow-[0_14px_30px_rgba(60,20,10,0.12)]"
      >
        <h1 className="font-serif text-2xl font-semibold text-maroon">Đăng nhập quản trị</h1>
        <p className="mt-1 text-sm text-[#6b6058]">Nhập mật khẩu để quản lý khách mời và lời nhắn.</p>

        <input
          type="password"
          autoFocus
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          placeholder="Mật khẩu"
          className="focus-ring mt-6 w-full rounded-lg border border-[#d8bf8e] bg-[#fffdf9] p-3 text-[#4d4038] focus:border-maroon"
        />

        {error && <p className="mt-2 text-sm text-maroon">{error}</p>}

        <button
          type="submit"
          disabled={loading || !password}
          className="focus-ring mt-5 inline-flex min-h-[46px] w-full items-center justify-center rounded-full bg-[#5c0c0d] px-6 text-xs font-semibold uppercase tracking-[0.3em] text-warm-white transition-colors hover:bg-[#4c0709] disabled:opacity-60"
        >
          {loading ? "Đang vào..." : "Vào trang quản trị"}
        </button>
      </form>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
