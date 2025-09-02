export const fetchImages = async (
  pageNumber: number,
  searchVal: string,
  access_token: string
) => {
  try {
    const response = await fetch(
      "https://jxceaahrdymuhokduqdt.supabase.co/functions/v1/image-searcher",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${access_token}`,
        },
        body: JSON.stringify({ query: searchVal, page: pageNumber }),
      }
    );
    if (!response.ok) throw new Error("Failed to fetch images");

    const data = await response.json();

    const thumbs = data?.results
      .map((item: any) => item.urls?.thumb)
      .filter(Boolean);
    const regulars = data?.results
      .map((item: any) => item.urls?.regular)
      .filter(Boolean);

    return { thumbs, regulars, total_pages: data.total_pages };
  } catch (err: any) {
    // setError(err.message || "An error occurred");
    return { err };
  }
};
