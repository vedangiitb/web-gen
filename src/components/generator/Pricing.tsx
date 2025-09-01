"use client";
import { useState } from "react";
import { CheckCircle } from "lucide-react";
import { colorMap } from "./colorMap";
import EditingControls from "../editWebsite/EditingControls";

export type PricingProps = {
  content: { plans: { name: string; price: string; features: string[] }[] };
  style: GenStyles;
  editMode: boolean;
  updateData: (section: string, content: any) => void;
};

export default function Pricing({
  content,
  style,
  editMode,
  updateData,
}: PricingProps) {
  if (!content) return null;

  const bgColors = colorMap[style?.color || "zinc"];
  const mutedColors = colorMap[style?.muted || "gray"];

  const primary = style?.font.primary;
  const bodyFont = style?.font.body;

  // Track the field being edited, e.g., plan-0-name, plan-2-feature-1
  const [editElement, setEditElement] = useState<string>("");

  const isEditing = (id: string) => editMode && editElement === id;

  // Edit plan name/price/feature save logic
  function handleSave({
    planIdx,
    type,
    featIdx,
  }: {
    planIdx: number;
    type: "name" | "price" | "feature";
    featIdx?: number;
  }) {
    if (type === "feature" && typeof featIdx === "number") {
      const fieldId = `plan-${planIdx}-feature-${featIdx}`;
      const el = document.getElementById(fieldId);
      if (!el) return;
      const newPlans = [...content.plans];
      const newFeatures = [...newPlans[planIdx].features];
      newFeatures[featIdx] = el.textContent || "";
      newPlans[planIdx] = { ...newPlans[planIdx], features: newFeatures };
      updateData("Pricing", { ...content, plans: newPlans });
    } else {
      const fieldId = `plan-${planIdx}-${type}`;
      const el = document.getElementById(fieldId);
      if (!el) return;
      const newPlans = [...content.plans];
      newPlans[planIdx] = {
        ...newPlans[planIdx],
        [type]: el.textContent || "",
      };
      updateData("Pricing", { ...content, plans: newPlans });
    }
    setEditElement("");
  }

  // TODO: Implement Add/delete plans
  // Optional: For add/delete plans/features, you can uncomment the relevant code
  // const handleAddPlan = () => { ... }
  // const handleDeletePlan = (planIdx: number) => { ... }
  // const handleAddFeature = (planIdx: number) => { ... }
  // const handleDeleteFeature = (planIdx: number, featIdx: number) => { ... }

  function handleEditClick(id: string) {
    if (editMode) setEditElement(id);
  }

  return (
    <section className={`py-16 px-8 md:px-16 ${primary}`}>
      <h2
        className={`text-3xl md:text-4xl font-bold text-center mb-12 ${bgColors.text}`}
      >
        Pricing Plans
      </h2>

      {/* Uncomment if you want add plan */}
      {/* {editMode && (
        <button
          onClick={handleAddPlan}
          className="mb-8 px-6 py-2 rounded bg-blue-500 text-white font-semibold hover:bg-blue-600"
        >
          Add Plan
        </button>
      )} */}

      <div className="flex flex-wrap gap-8 justify-center">
        {content.plans.map((plan, planIdx) => (
          <div
            key={planIdx}
            className={`
              rounded-2xl shadow-lg p-8 w-full max-w-xs
              flex flex-col items-center
              hover:scale-105 hover:shadow-2xl transition
              border border-gray-200
              ${mutedColors.cardBgCol} ${mutedColors.cardBorderCol} ${mutedColors.cardTxtCol} shadow-sm
              relative
            `}
          >
            {/* Plan Name */}
            <h3
              id={`plan-${planIdx}-name`}
              suppressContentEditableWarning
              contentEditable={isEditing(`plan-${planIdx}-name`)}
              className={`text-xl font-semibold mb-2 ${
                editMode ? "cursor-pointer outline-dashed px-1 transition " : ""
              }${
                isEditing(`plan-${planIdx}-name`)
                  ? "outline-blue-500 shadow-md"
                  : ""
              }`}
              onClick={(e) => {
                e.stopPropagation();
                handleEditClick(`plan-${planIdx}-name`);
              }}
            >
              {plan.name}
            </h3>
            {isEditing(`plan-${planIdx}-name`) && (
              <EditingControls
                handleSave={() => handleSave({ planIdx, type: "name" })}
                setEditElement={setEditElement}
              />
            )}

            {/* Price */}
            <p
              id={`plan-${planIdx}-price`}
              suppressContentEditableWarning
              contentEditable={isEditing(`plan-${planIdx}-price`)}
              className={`text-3xl font-bold ${bgColors.secondaryButtonBg} ${
                bgColors.secondaryTxtCol
              } mb-6 px-4 py-2 rounded-md ${
                editMode ? "cursor-pointer outline-dashed px-1 transition " : ""
              }${
                isEditing(`plan-${planIdx}-price`)
                  ? "outline-blue-500 shadow-md"
                  : ""
              }`}
              onClick={(e) => {
                e.stopPropagation();
                handleEditClick(`plan-${planIdx}-price`);
              }}
            >
              {plan.price}
            </p>
            {isEditing(`plan-${planIdx}-price`) && (
              <EditingControls
                handleSave={() => handleSave({ planIdx, type: "price" })}
                setEditElement={setEditElement}
              />
            )}

            {/* Features */}
            <ul className="w-full space-y-3 mb-2">
              {plan.features.map((feat, featIdx) => (
                <li
                  key={featIdx}
                  className={`flex items-center gap-2 ${bodyFont} relative`}
                >
                  <CheckCircle className={`h-5 w-5`} />
                  <span
                    id={`plan-${planIdx}-feature-${featIdx}`}
                    suppressContentEditableWarning
                    contentEditable={isEditing(
                      `plan-${planIdx}-feature-${featIdx}`
                    )}
                    className={`${
                      editMode ? "cursor-pointer outline-dashed px-1 transition" : ""
                    } ${
                      isEditing(`plan-${planIdx}-feature-${featIdx}`)
                        ? "outline-blue-500 shadow-md"
                        : ""
                    }`}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEditClick(`plan-${planIdx}-feature-${featIdx}`);
                    }}
                  >
                    {feat}
                  </span>
                  {isEditing(`plan-${planIdx}-feature-${featIdx}`) && (
                    <EditingControls
                      handleSave={() =>
                        handleSave({ planIdx, type: "feature", featIdx })
                      }
                      setEditElement={setEditElement}
                    />
                  )}
                  {/* Uncomment if you want delete feature */}
                  {/* {editMode && (
                    <button className="ml-2 text-red-500" onClick={() => handleDeleteFeature(planIdx, featIdx)}>&times;</button>
                  )} */}
                </li>
              ))}
              {/* Uncomment if you want add feature per plan */}
              {/* {editMode && (
                <li><button className="text-blue-600 underline" onClick={() => handleAddFeature(planIdx)}>+ Add Feature</button></li>
              )} */}
            </ul>

            {/* Uncomment if you want delete plan */}
            {/* {editMode && (
              <button
                onClick={() => handleDeletePlan(planIdx)}
                className="absolute top-2 right-2 text-red-500 hover:text-red-700"
              >
                &times;
              </button>
            )} */}
          </div>
        ))}
      </div>
    </section>
  );
}
