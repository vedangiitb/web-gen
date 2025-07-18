import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Check, MoveRight, X } from "lucide-react";
import { useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";

export default function ImageSearcher({
  access_token,
  cancel,
  updateImage,
}: {
  access_token: string;
  cancel: React.Dispatch<React.SetStateAction<boolean>>;
  updateImage: any;
}) {
  const [searchVal, setSearchVal] = useState("");
  const [loading, setLoading] = useState(false);
  const [optimageList, setoptImageList] = useState<string[]>([]);
  const [imageList, setImageList] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState(true);

  const startNewSearch = async () => {
    if (!searchVal.trim()) return;
    setImageList([]);
    setoptImageList([]);
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

      const imgLinks = data?.results
        .map((item: any) => item.urls?.thumb)
        .filter(Boolean);

      const imgLinksrl = data?.results
        .map((item: any) => item.urls?.regular)
        .filter(Boolean);

      setoptImageList((old) =>
        isNewSearch ? imgLinks : [...old, ...imgLinks]
      );
      setImageList((old) =>
        isNewSearch ? imgLinksrl : [...old, ...imgLinksrl]
      );

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
      <div className="flex justify-between items-center mb-2 ">
        <p className="font-semibold text-lg">Search Image</p>
        <X className="cursor-pointer" onClick={() => cancel(false)} />
      </div>

      <div className="flex gap-4 items-center mb-4">
        <Input
          value={searchVal}
          onChange={(e) => setSearchVal(e.target.value)}
          placeholder="e.g., a person giving an interview..."
          onKeyDown={async (e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              await startNewSearch();
            }
          }}
        />
        <Button onClick={startNewSearch}>
          <MoveRight className="w-5 h-5" />
        </Button>
      </div>

      {error && <p className="text-red-500">{error}</p>}

      {optimageList.length == 0 && (
        <div>
          <p>Search to get started!</p>
        </div>
      )}

      {optimageList.length > 0 && (
        <InfiniteScroll
          dataLength={optimageList.length}
          next={() => fetchImages(page)}
          hasMore={hasMore}
          loader={<p className="text-blue-500 text-center mt-4">Loading...</p>}
          scrollableTarget="scrollableDiv"
        >
          <div className="grid grid-cols-2 gap-2">
            {optimageList.map((url, index) => (
              <div
                className="relative group"
                onClick={() => {
                  updateImage(imageList[index]);
                }}
              >
                <img
                  key={index}
                  src={url}
                  alt={`search result ${index + 1}`}
                  className="mb-2 rounded-sm w-full shadow hover:scale-105 transition duration-300 group-hover:brightness-75"
                  loading="lazy"
                />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 group-hover:cursor-pointer transition duration-300">
                  <Check></Check>
                </div>
              </div>
            ))}
          </div>
        </InfiniteScroll>
      )}
    </div>
  );
}
