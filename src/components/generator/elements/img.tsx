// for rendering / modifying images

import { AnimatePresence, motion } from "framer-motion";
import { Pen } from "lucide-react";

export default function Img({
  heroImg,
  editMode,
  setShowImgBox,
  alt
}: {
  heroImg: string;
  editMode: boolean;
  setShowImgBox: any;
  alt:string
}) {
  return (
    <div className="flex-1 w-full flex justify-center items-center">
      <AnimatePresence mode="wait">
        {heroImg && (
          <motion.div
            key={heroImg}
            initial={{ opacity: 0, scale: 0.98, filter: "blur(10px)" }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
            transition={{ duration: 0.5, type: "spring" }}
            className="relative group"
            onClick={() => {
              if (!editMode) return;
              setShowImgBox();
            }}
          >
            <img
              src={
                heroImg ||
                "https://images.unsplash.com/photo-1510936111840-65e151ad71bb?auto=format&fit=cover&w=800&q=80"
              }
              alt={alt}
              className={`w-full max-w-md rounded-2xl shadow-xl object-cover
                  ${
                    editMode
                      ? "transition duration-300 group-hover:brightness-75"
                      : ""
                  }`}
            />
            {editMode && (
              <div className="absolute inset-0 flex items-center justify-center group-hover:opacity-100 group-hover:cursor-pointer transition duration-300">
                <Pen />
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
