import { getRequestConfig } from "next-intl/server";
import { cookies, headers } from "next/headers";
import { notFound } from "next/navigation";

const locales = ["en", "de"];

export default getRequestConfig(async () => {
  // Provide a static locale, fetch a user setting,
  // read from `cookies()`, `headers()`, etc.
  //const headersList = headers();
  //const defaultLocale = headersList.get("accept-language");
  //const locale = cookies().get("NEXT_LOCALE")?.value || defaultLocale || "en";

  const locale = "en";
  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default,
  };
});
