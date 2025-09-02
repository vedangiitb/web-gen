import { useState } from "react";
import Header from "./Header";
import ImageGrid from "./ImageGrid";
import SearchBar from "./SearchBar";
import { imageSearch } from "@/hooks/editWebsiteHooks/imageSearcher";

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

  const {
    optimageList,
    imageList,
    startNewSearch,
    getImages,
    page,
    hasMore,
    error,
  } = imageSearch(access_token, searchVal);

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
          fetchMore={() => getImages(page)}
          hasMore={hasMore}
        />
      )}
    </div>
  );
}
