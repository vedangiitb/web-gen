"use client";
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Accordion } from "@radix-ui/react-accordion";
import { Check, Paintbrush, Pen, Settings } from "lucide-react";
import { getFontsList, getRelColList } from "./stylesEdit";

export default function StyleSettings({
  stylesFromLLM,
  setStylesFromLLM,
  initialStyles,
  setChanges,
}: {
  stylesFromLLM: GenStyles;
  setStylesFromLLM: any;
  initialStyles: GenStyles;
  setChanges: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  return (
    <div>
      <Popover>
        <PopoverTrigger>
          <Settings
            className="cursor-pointer w-5 h-5"
            aria-label="Open settings"
          />
        </PopoverTrigger>
        <PopoverContent className="space-y-3 mr-4 p-4 rounded-lg shadow-lg bg-background border border-border max-w-xs">
          <Accordion type="single" className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger className="cursor-pointer">
                <div className="flex gap-2 items-center">
                  <Paintbrush className="w-4 h-4"></Paintbrush>
                  <span className="font-medium text-sm">Theme Colors</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="p-2 space-y-2 max-h-60 overflow-y-scroll custom-scrollbar">
                {getRelColList(initialStyles).map((item, idx) => {
                  const colorClass = `${item.color}`;
                  const mutedClass = `${item.muted}`;
                  const isSelected =
                    item.col1 === stylesFromLLM.color &&
                    item.col2 === stylesFromLLM.muted;

                  return (
                    <div
                      key={idx}
                      className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-all border border-transparent ${
                        isSelected
                          ? "ring-2 ring-primary bg-primary/10"
                          : "hover:ring-2 hover:ring-accent hover:bg-accent/10"
                      }`}
                      onClick={() => {
                        setStylesFromLLM((prev: any) => {
                          return {
                            color: item.col1,
                            muted: item.col2,
                            font: prev.font,
                          };
                        });
                        setChanges(true);
                      }}
                      aria-selected={isSelected}
                      tabIndex={0}
                      title={`Select ${item.col1} / ${item.col2}`}
                    >
                      <div className="flex gap-1">
                        <div
                          className={`w-6 h-6 rounded ${colorClass} border border-border shadow-sm`}
                          title={item.col1}
                        />
                        <div
                          className={`w-6 h-6 rounded ${mutedClass} border border-border shadow-sm`}
                          title={item.col2}
                        />
                      </div>
                      <span className="text-xs font-mono text-muted-foreground">
                        {item.col1} / {item.col2}
                      </span>
                      {isSelected && (
                        <Check
                          className="text-primary ml-auto"
                          size={18}
                          aria-label="Selected"
                        />
                      )}
                    </div>
                  );
                })}
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2">
              <AccordionTrigger className="cursor-pointer">
                <div className="flex items-center gap-2">
                  <Pen className="w-4 h-4"></Pen>
                  <span className="font-medium text-sm">Font Styles</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="p-2 space-y-2 max-h-60 overflow-y-scroll custom-scrollbar">
                {getFontsList().map((item, idx) => {
                  const isSelected =
                    item.primary === stylesFromLLM.font.primary &&
                    item.body === stylesFromLLM.font.body;

                  return (
                    <div
                      key={idx}
                      className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-all border border-transparent ${
                        isSelected
                          ? "ring-2 ring-primary bg-primary/10"
                          : "hover:ring-2 hover:ring-accent hover:bg-accent/10"
                      }`}
                      onClick={() => {
                        setStylesFromLLM((prev: any) => {
                          return {
                            ...prev,
                            font: {
                              primary: item.primary,
                              body: item.body,
                            },
                          };
                        });
                        setChanges(true);
                      }}
                      aria-selected={isSelected}
                      tabIndex={0}
                      title={`Select ${item.primary} / ${item.body}`}
                    >
                      <span className={`font-${item.primary} text-base`}>
                        {item.primary}
                      </span>
                      <span className="text-xs font-mono text-muted-foreground">
                        {item.body}
                      </span>
                      {isSelected && (
                        <Check
                          className="text-primary ml-auto"
                          size={18}
                          aria-label="Selected"
                        />
                      )}
                    </div>
                  );
                })}
              </AccordionContent>
            </AccordionItem>
          </Accordion>{" "}
        </PopoverContent>
      </Popover>
    </div>
  );
}
