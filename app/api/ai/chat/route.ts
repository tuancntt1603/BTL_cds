import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY;
const modelName = process.env.GEMINI_MODEL || "gemini-1.5-flash";

export async function POST(req: NextRequest) {
  try {
    const { message, conversationHistory = [] } = await req.json();

    if (!message || typeof message !== "string" || !message.trim()) {
      return NextResponse.json({ error: "Tin nhắn rỗng", response: "Tin nhắn rỗng" }, { status: 400 });
    }

    if (!apiKey) {
      console.error("Missing GEMINI_API_KEY env var");
      return NextResponse.json(
        {
          error: "Missing GEMINI_API_KEY",
          response: "Cấu hình AI chưa đầy đủ. Vui lòng thiết lập API key và khởi động lại server.",
          source: "config",
          timestamp: new Date().toISOString(),
        },
        { status: 500 }
      );
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: modelName });

    const systemPrompt =
      "Bạn là trợ lý AI thân thiện của ứng dụng \"Đổi đồ cũ\" tại Việt Nam. Trả lời bằng tiếng Việt, ngắn gọn, thân thiện (có thể dùng emoji nhẹ). Ưu tiên hướng dẫn cụ thể: đăng đồ, tìm kiếm, đổi đồ, QR code, đánh giá. Không trả lời ngoài chủ đề ứng dụng.";

    const historyParts = Array.isArray(conversationHistory)
      ? conversationHistory
          .filter((h: any) => h && typeof h.content === "string" && h.content.trim())
          .map((h: any) => ({ role: h.role === "user" ? "user" : "model", parts: [{ text: h.content }] }))
      : [];

    const chat = model.startChat({
      history: [
        { role: "user", parts: [{ text: systemPrompt }] },
        { role: "model", parts: [{ text: "Đã hiểu." }] },
        ...historyParts,
      ],
    });

    let text = "";
    try {
      const result = await chat.sendMessage(message);
      const response = await result.response;
      text = response.text();
    } catch (sdkErr: any) {
      const msg = sdkErr?.message || String(sdkErr);
      console.error("Gemini SDK error:", msg);
      // Map một số lỗi phổ biến thành thông điệp rõ ràng
      if (/permission|unauthorized|invalid api key|api key/i.test(msg)) {
        return NextResponse.json(
          {
            error: "API key không hợp lệ hoặc thiếu quyền",
            response: "API key không hợp lệ hoặc chưa bật quyền cho model. Vui lòng kiểm tra cấu hình và thử lại.",
            source: "gemini",
            timestamp: new Date().toISOString(),
          },
          { status: 500 }
        );
      }
      if (/quota|rate|429/i.test(msg)) {
        return NextResponse.json(
          {
            error: "Vượt hạn mức hoặc bị giới hạn tốc độ",
            response: "Hệ thống AI đang quá tải hoặc vượt hạn mức. Vui lòng thử lại sau.",
            source: "gemini",
            timestamp: new Date().toISOString(),
          },
          { status: 500 }
        );
      }
      // Fallback lỗi chung: trả lời hữu ích để UI luôn hiển thị nội dung
      return NextResponse.json(
        {
          error: msg,
          response:
            "Hiện hệ thống AI đang gặp sự cố. Bạn có thể thử lại sau.\n\n" +
            "Trong lúc chờ, đây là hướng dẫn nhanh:\n" +
            "1) Đăng đồ: Vào mục Items > New, điền tiêu đề, mô tả, hình ảnh, chọn danh mục rồi đăng.\n" +
            "2) Tìm kiếm: Dùng thanh tìm kiếm trên trang Items, lọc theo danh mục/giá/tình trạng.\n" +
            "3) Quy trình đổi đ��: Nhắn người đăng qua Chat, thống nhất, tạo giao dịch và xác nhận bằng QR khi hoàn tất.\n" +
            "4) QR Code: Mỗi giao dịch có mã QR riêng để xác nhận khi trao đổi xong.\n" +
            "5) Đánh giá/Uy tín: Sau khi giao dịch, hãy để lại đánh giá để tăng độ uy tín.",
          source: "fallback",
          timestamp: new Date().toISOString(),
        },
        { status: 200 }
      );
    }

    return NextResponse.json({
      response: text,
      timestamp: new Date().toISOString(),
      source: "gemini",
    });
  } catch (err: any) {
    console.error("AI route error:", err?.message || err);
    const msg = err?.message || String(err);
    if (/quota|rate|429|RESOURCE_EXHAUSTED|UNAVAILABLE|overloaded|capacity/i.test(msg)) {
      return NextResponse.json(
        {
          error: "AI_OVERLOADED",
          response: "Hệ thống AI đang quá tải hoặc vượt hạn mức. Vui lòng thử lại sau.",
          timestamp: new Date().toISOString(),
          source: "gemini",
        },
        { status: 429 }
      );
    }
    return NextResponse.json(
      {
        error: "Lỗi hệ thống AI",
        response: "Xin lỗi, AI đang gặp trục trặc. Hãy thử lại sau.",
        timestamp: new Date().toISOString(),
        source: "error",
      },
      { status: 500 }
    );
  }
}
