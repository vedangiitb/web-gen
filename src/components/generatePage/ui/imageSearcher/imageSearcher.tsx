import { useState } from "react";
import Header from "./Header";
import ImageGrid from "./ImageGrid";
import SearchBar from "./SearchBar";

export default function ImageSearcher({
  access_token,
  cancel,
  updateImage,
}: {
  access_token: string;
  cancel: React.Dispatch<React.SetStateAction<boolean>>;
  updateImage: (url: string) => void;
}) {
  const [searchVal, setSearchVal] = useState("");
  const [loading, setLoading] = useState(false);
  const [optimageList, setOptImageList] = useState<string[]>([]);
  const [imageList, setImageList] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState(true);

  const startNewSearch = async () => {
    if (!searchVal.trim()) return;
    setImageList([]);
    setOptImageList([]);
    setPage(1);
    setHasMore(true);
    await fetchImages(1, true);
  };

  const fetchImages = async (pageNumber: number, isNewSearch = false) => {
    if (!searchVal.trim() || loading) return;
    setLoading(true);
    setError(null);
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

      setOptImageList((prev) => (isNewSearch ? thumbs : [...prev, ...thumbs]));
      setImageList((prev) => (isNewSearch ? regulars : [...prev, ...regulars]));

      if (pageNumber >= data.total_pages) setHasMore(false);
      setPage(pageNumber + 1);
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="w-full max-w-md border-l-2 p-4 h-[calc(100vh-5rem)] overflow-auto custom-scrollbar"
      id="scrollableDiv"
    >
      <Header onClose={() => cancel(false)} />
      <SearchBar
        value={searchVal}
        onChange={(val) => setSearchVal(val)}
        onSearch={startNewSearch}
      />
      {error && <p className="text-red-500">{error}</p>}
      {optimageList.length === 0 ? (
        <p>Search to get started!</p>
      ) : (
        <ImageGrid
          thumbUrls={optimageList}
          fullUrls={imageList}
          onSelect={updateImage}
          fetchMore={() => fetchImages(page)}
          hasMore={hasMore}
        />
      )}
    </div>
  );
}
