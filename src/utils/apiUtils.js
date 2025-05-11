/**
 * Safely parses JSON response and handles HTML error responses
 * @param {Response} response - The fetch Response object
 * @returns {Promise<any>} Parsed JSON data
 */
export const safeJsonParse = async (response) => {
  const contentType = response.headers.get("content-type");

  if (!response.ok) {
    // Check if error response is HTML
    if (contentType && contentType.includes("text/html")) {
      const htmlContent = await response.text();
      console.error("Received HTML error page instead of JSON:", htmlContent);
      throw new Error(
        `Server returned HTML instead of JSON (Status: ${response.status})`
      );
    }

    // Try to parse error as JSON if possible
    try {
      const errorJson = await response.json();
      throw new Error(errorJson.message || `API error (${response.status})`);
    } catch (e) {
      throw new Error(`API request failed with status ${response.status}`);
    }
  }

  // Ensure content is JSON before parsing
  if (!contentType || !contentType.includes("application/json")) {
    const text = await response.text();
    console.error("Unexpected non-JSON response:", text);
    throw new Error("Received non-JSON response from server");
  }

  return await response.json();
};
