"use client";
import { useState } from "react";
import { Star } from "lucide-react";
import { colorMap } from "./colorMap";
import EditingControls from "./EditingControls";

export type TestimonialProps = {
  content: { userReviews: string[]; userRatings: number[] };
  style: GenStyles;
  editMode: boolean;
  updateData: (section: string, content: any) => void;
};

export default function Testimonials({ content, style, editMode, updateData }: TestimonialProps) {
  if (!content) return null;

  const bgColors = colorMap[style?.color || "zinc"];
  const mutedColors = colorMap[style?.muted || "gray"];

  const primary = style?.font.primary;
  const bodyFont = style?.font.body;

  // Track which review or rating is being edited ("review-2" or "rating-1")
  const [editElement, setEditElement] = useState<string>("");

  const isEditing = (id: string) => editMode && editElement === id;

  // Save logic for review text
  const handleSaveReview = (idx: number) => {
    const id = `review-${idx}`;
    const el = document.getElementById(id);
    if (!el) return;
    const newReviews = [...content.userReviews];
    newReviews[idx] = el.textContent || "";
    updateData("Testimonials", { ...content, userReviews: newReviews });
    setEditElement("");
  };

  // Save logic for rating
  const handleSaveRating = (idx: number, val: number) => {
    const newRatings = [...content.userRatings];
    newRatings[idx] = val;
    updateData("Testimonials", { ...content, userRatings: newRatings });
    setEditElement(""); // Optionally keep editing on, if you want
  };

  // Optionally: Add/Delete controls
  // const handleAdd = () => {
  //   updateData("Testimonials", {
  //     ...content,
  //     userReviews: [...content.userReviews, "New review..."],
  //     userRatings: [...content.userRatings, 5],
  //   });
  // };
  // const handleDelete = (idx: number) => {
  //   updateData("Testimonials", {
  //     ...content,
  //     userReviews: content.userReviews.filter((_, i) => i !== idx),
  //     userRatings: content.userRatings.filter((_, i) => i !== idx),
  //   });
  // };

  return (
    <section className={`py-24 px-8 md:px-16 ${primary}`}>
      <h2
        className={`text-3xl md:text-4xl font-bold text-center mb-12 ${bgColors.text}`}
      >
        What Our Users Say
      </h2>

      {/* Uncomment for Add button in edit mode */}
      {/* {editMode && (
        <button
          onClick={handleAdd}
          className="mb-10 px-6 py-2 rounded bg-blue-500 text-white font-semibold hover:bg-blue-600"
        >
          Add Testimonial
        </button>
      )} */}

      <div className="flex gap-8 overflow-x-auto pb-4 justify-center">
        {content.userReviews.map((review, idx) => (
          <div
            key={idx}
            className={`
              flex-shrink-0 w-80 rounded-2xl shadow-lg p-6
              flex flex-col justify-between
              hover:shadow-2xl transition border ${mutedColors.cardBgCol} ${mutedColors.cardBorderCol} ${mutedColors.cardTxtCol}
              relative
            `}
          >
            {/* Review Text */}
            <p
              id={`review-${idx}`}
              suppressContentEditableWarning
              contentEditable={isEditing(`review-${idx}`)}
              className={`text-lg italic mb-6 ${mutedColors.text} ${bodyFont} ${
                editMode
                  ? `outline-dashed px-1 transition ${
                      isEditing(`review-${idx}`) ? "outline-blue-500 shadow-md" : ""
                    }`
                  : ""
              }`}
              onClick={e => { e.stopPropagation(); handleEditClick(`review-${idx}`); }}
            >
              {review}
            </p>
            {isEditing(`review-${idx}`) && (
              <EditingControls
                handleSave={() => handleSaveReview(idx)}
                setEditElement={setEditElement}
              />
            )}

            {/* Rating */}
            <div className="flex items-center gap-2 mt-auto">
              {[...Array(5)].map((_, i) => {
                const filled = i < content.userRatings[idx];
                return (
                  <span
                    key={i}
                    className={
                      editMode
                        ? "cursor-pointer"
                        : ""
                    }
                    onClick={e => {
                      if (editMode) {
                        setEditElement(`rating-${idx}`);
                        handleSaveRating(idx, i + 1);
                        e.stopPropagation();
                      }
                    }}
                  >
                    <Star
                      className={`h-5 w-5 ${
                        filled
                          ? "text-yellow-400 fill-yellow-400"
                          : "text-gray-300"
                      } ${
                        editMode && isEditing(`rating-${idx}`)
                          ? "ring-2 ring-blue-500 ring-offset-1"
                          : ""
                      }`}
                      fill={filled ? "currentColor" : "none"}
                    />
                  </span>
                );
              })}
              <span className={`ml-2 font-semibold ${bodyFont}`}>
                ({content.userRatings[idx]}/5)
              </span>
            </div>
            {/* Optionally, allow user to finish rating edit (leave as is for now) */}

            {/* Uncomment for Delete button per review */}
            {/* {editMode && (
              <button
                onClick={() => handleDelete(idx)}
                className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                title="Delete Testimonial"
              >
                &times;
              </button>
            )} */}
          </div>
        ))}
      </div>
    </section>
  );

  function handleEditClick(id: string) {
    if (editMode) setEditElement(id);
  }
}
