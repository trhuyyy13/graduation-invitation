const mapQuery =
  "Hội trường C2, Đại học Bách khoa Hà Nội, Số 1 Đại Cồ Việt, Hai Bà Trưng, Hà Nội";

export const eventConfig = {
  graduateFullName: "Trần Quang Huy",
  graduateDisplayName: "Huy Trần",
  graduateFirstName: "Huy",
  graduateNameParts: ["TRẦN", "QUANG", "HUY"] as const,
  university: "Đại học Bách khoa Hà Nội",
  universityShort: "HUST",
  foundingYear: 1956,
  year: 2026,

  date: "2026-09-26",
  weekdayLabel: "THỨ BẢY",
  day: "26",
  month: "09",
  yearLabel: "2026",
  startTime: "09:00",
  endTime: "12:00",

  venue: "Hội trường C2",
  address: "Số 1 Đại Cồ Việt, Hai Bà Trưng, Hà Nội",
  mapUrl: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mapQuery)}`,
  contactPhone: "0865.505.899",

  // {self}/{Self} = how Huy refers to himself with this guest (guest.selfRef);
  // {you}/{You} = how Huy addresses this guest (guest.salutation). See personalize() in PersonalMessage.tsx.
  personalMessage: {
    paragraphs: [
      "Vậy là hành trình của {self} tại Bách Khoa cũng đã đi đến một cột mốc thật đặc biệt.\nCó những ngày vui, những lần chạy deadline, những khoảnh khắc đáng nhớ và rất nhiều người đã đồng hành cùng {self} trên chặng đường ấy.",
      "{Self} rất vui nếu có thể gặp {you} trong ngày tốt nghiệp, cùng lưu lại một vài khoảnh khắc của ngày đặc biệt này.",
      "Và nếu {you} có đôi lời muốn gửi đến {self}, hãy để lại ở phía dưới nhé.\n{Self} sẽ rất trân trọng từng lời nhắn.",
    ],
    signature: "Huy Trần",
  },
};

export type EventConfig = typeof eventConfig;
