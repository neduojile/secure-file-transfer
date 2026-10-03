"use client";

import ReplaceFilePanel from "./replace-file-panel";
import ForwardPacketButton from "./forward-packet-button";

interface Props {
  transferId: string;
}

export default function PacketActions({
  transferId,
}: Props) {
  return (
    <div className="space-y-6">
      <ForwardPacketButton transferId={transferId} />

      <div className="border-t border-slate-800 pt-6">
        <ReplaceFilePanel
          transferId={transferId}
        />
      </div>
    </div>
  );
}
