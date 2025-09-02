// src/helper/fetchLogger.ts

if (__DEV__) {
  // Cho phép debug XHR trong Chrome DevTools
  (global as any).XMLHttpRequest = (global as any).originalXMLHttpRequest
    ? (global as any).originalXMLHttpRequest
    : (global as any).XMLHttpRequest;

  // Giữ lại fetch gốc
  (global as any)._fetch = fetch;

  // Patch fetch
  (global as any).fetch = async (uri: RequestInfo | URL, options?: RequestInit, ...args: any[]) => {
    const start = Date.now();
    const response = await (global as any)._fetch(uri, options, ...args);
    const duration = Date.now() - start;

    let body: any = null;
    try {
      // Clone để đọc body mà không mất stream gốc
      body = await response.clone().json();
    } catch {
      body = '<non-JSON body>';
    }

    console.log('[Fetch]', {
      request: { uri, options },
      status: response.status,
      duration: `${duration}ms`,
      body,
    });

    return response;
  };
}
