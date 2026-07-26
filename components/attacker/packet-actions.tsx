"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

import ReplaceFilePanel from "./replace-file-panel";
import ForwardPacketButton from "./forward-packet-button";

interface Props {
  transferId: string;
}

export default function PacketActions({
  transferId,
}: Props) {
  const [replacementDone, setReplacementDone] = useState(false);

  return (
    <div className="space-y-6">
      <ReplaceFilePanel
        transferId={transferId}
        onReplacementSuccess={() => setReplacementDone(true)}
      />

      <AnimatePresence>
        {replacementDone && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            transition={{ duration: 0.35 }}
          >
            <ForwardPacketButton transferId={transferId} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}