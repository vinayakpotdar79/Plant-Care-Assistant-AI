import { useState } from "react";
import Chatbot from "./Chatbot";
import { motion } from "framer-motion";

export default function PlantBot() {
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed top-4/5 right-6 flex flex-col items-end">
      {/* Chat Window */}
      {open && <Chatbot  onClose={() => setOpen(false)} />}
      {/* Plant Icon */}
      {!open && <motion.div
        onClick={() => setOpen(!open)}
        animate={{ y: [0, -50, 0] }}
        transition={{ repeat: Infinity, duration: 3.5 }}
        className="w-16 h-16 bg-green-200 rounded-full flex items-center justify-center shadow-lg cursor-pointer hover:scale-110 transition-transform"
      >
       <h1 className="text-3xl">🌱</h1>
      </motion.div>}
    </div>
  );
}
