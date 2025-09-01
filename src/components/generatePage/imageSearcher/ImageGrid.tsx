import InfiniteScroll from "react-infinite-scroll-component";
import ImageCard from "./ImageCard";

export default function ImageGrid({
  thumbUrls,
  fullUrls,
  onSelect,
  fetchMore,
  hasMore,
}: {
  thumbUrls: string[];
  fullUrls: string[];
  onSelect: (url: string) => void;
  fetchMore: () => void;
  hasMore: boolean;
}) {
  return (
    <InfiniteScroll
      dataLength={thumbUrls.length}
      next={fetchMore}
      hasMore={hasMore}
      loader={<p className="text-blue-500 text-center mt-4">Loading...</p>}
      scrollableTarget="scrollableDiv"
    >
      <div className="grid grid-cols-2 gap-2">
        {thumbUrls.map((url, index) => (
          <ImageCard
            key={index}
            thumbUrl={url}
            fullUrl={fullUrls[index]}
            onClick={() => onSelect(fullUrls[index])}
          />
        ))}
      </div>
    </InfiniteScroll>
  );
}
