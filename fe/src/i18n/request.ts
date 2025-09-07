import { getRequestConfig } from "next-intl/server";
import { cookies } from "next/headers";

export default getRequestConfig(async () => {
  const cookieStore = await cookies();
  const cookieLocale = cookieStore.get("NEXT_LOCALE")?.value;
  const supportedLocales = ["vi", "en", "ja"];
  const defaultLocale = "vi";

  //   Nếu không hợp lệ dùng mặc định
  const locale = supportedLocales.includes(cookieLocale || "")
    ? cookieLocale!
    : defaultLocale;

  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default,
    timeZone: "Asia/Ho_Chi_Minh",
  };
});
