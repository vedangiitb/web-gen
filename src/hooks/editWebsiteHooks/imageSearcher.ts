"use client";
import { fetchImages } from "@/services/editWebsiteServices/fetchImages";
import { useState } from "react";

export function imageSearch(access_token: string, searchVal: string) {
  const [loading, setLoading] = useState(false);
  const [optimageList, setOptImageList] = useState<string[]>([]);
  const [imageList, setImageList] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState(true);

  const startNewSearch = async () => {
    if (!searchVal.trim() || loading) return;
    setImageList([]);
    setOptImageList([]);
    setPage(1);
    setHasMore(true);
    getImages(1, true);
  };

  const getImages = async (pageNumber: number, isNewSearch = false) => {
    console.log("Called", searchVal, loading);
    if (!searchVal.trim() || loading) return;
    setLoading(true);
    setError(null);
    const { thumbs, regulars, total_pages, err } = await fetchImages(
      pageNumber,
      searchVal,
      access_token
    );

    if (err) {
      setError(err.message || "An error occurred");
      return;
    }

    setOptImageList((prev) => (isNewSearch ? thumbs : [...prev, ...thumbs]));
    setImageList((prev) => (isNewSearch ? regulars : [...prev, ...regulars]));

    if (pageNumber >= total_pages) setHasMore(false);
    setPage(pageNumber + 1);
    setLoading(false);
  };

  return {
    optimageList,
    imageList,
    startNewSearch,
    getImages,
    page,
    hasMore,
    error,
  };
}
