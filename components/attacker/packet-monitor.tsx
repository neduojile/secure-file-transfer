"use client";

import { useEffect, useState } from "react";

type Packet = {
  id: string;
  fileName: string;
  fileSize: number;
  encrypted: boolean;
  status: string;
  createdAt: string;
  sender: {
    fullName: string;
    email: string;
  };
  receiver: {
    fullName: string;
    email: string;
  } | null;
};

type PacketResponse = {
  success: boolean;
  statistics: {
    totalPackets: number;
    encryptedPackets: number;
    plainPackets: number;
  };
  packets: Packet[];
};

export default function PacketMonitor() {
  const [data, setData] = useState<PacketResponse | null>(null);
  const [loading, setLoading] = useState(true);

  async function loadPackets() {
    try {
      const res = await fetch("/api/attacker/packets", {
        cache: "no-store",
      });

      const json = await res.json();

      setData(json);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadPackets();

    const interval = setInterval(loadPackets, 1000);

    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="text-white text-center py-20">
        Loading intercepted packets...
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="grid md:grid-cols-3 gap-5">
        <div className="rounded-xl bg-zinc-900 border border-zinc-800 p-6">
          <h3 className="text-zinc-400 text-sm">Packets</h3>
          <p className="text-4xl font-bold text-white mt-2">
            {data?.statistics?.totalPackets ?? 0}
          </p>
        </div>

        <div className="rounded-xl bg-zinc-900 border border-green-700 p-6">
          <h3 className="text-green-400 text-sm">
            Encrypted
          </h3>

          <p className="text-4xl font-bold text-green-500 mt-2">
            {data?.statistics?.encryptedPackets ?? 0}
          </p>
        </div>

        <div className="rounded-xl bg-zinc-900 border border-yellow-700 p-6">
          <h3 className="text-yellow-400 text-sm">
            Plain Files
          </h3>

          <p className="text-4xl font-bold text-yellow-400 mt-2">
            {data?.statistics?.plainPackets ?? 0}
          </p>
        </div>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-slate-700 bg-slate-950/70 shadow-xl">
        <table className="w-full min-w-[760px] text-left text-sm text-slate-200">
          <thead className="bg-slate-900 text-xs uppercase tracking-wider text-slate-400">
            <tr className="text-left">
              <th className="p-4">File</th>
              <th>Sender</th>
              <th>Receiver</th>
              <th>Encryption</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {data?.packets.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="text-center py-10 text-zinc-500"
                >
                  No packets currently travelling.
                </td>
              </tr>
            ) : (
              data?.packets.map((packet) => (
                <tr
                  key={packet.id}
                  className="border-t border-slate-800 transition-colors hover:bg-white/[0.04]"
                >
                  <td className="p-4 font-medium">
                    {packet.fileName}
                  </td>

                  <td>{packet.sender.fullName}</td>

                  <td>
                        {packet.receiver
                        ? packet.receiver.fullName
                        : "Unknown Receiver"}
                  </td>

                  <td>
                    {packet.encrypted ? (
                      <span className="font-semibold text-emerald-400">AES-256 Encrypted</span>
                    ) : (
                      <span className="text-yellow-500">
                        âŒ Plain
                      </span>
                    )}
                  </td>

                  <td>
                    <span className="text-cyan-400">
                      {packet.status}
                    </span>
                  </td>

                  <td>
                    <div className="flex gap-2">
                     <button
  onClick={() => {
    window.location.href = `/attacker/packets/${packet.id}`;
  }}
  className="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded text-sm"
>
  Inspect
</button>

                    <button
  onClick={async () => {
    const res = await fetch("/api/attacker/forward", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        transferId: packet.id,
      }),
    });

    const result = await res.json();

    if (!result.success) {
      alert(result.error);
      return;
    }

    await loadPackets();
  }}
  className="bg-green-600 hover:bg-green-700 px-3 py-1 rounded text-sm"
>
  Forward
</button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <p className="text-center text-xs text-zinc-500">
        Auto refreshing every 3 seconds...
      </p>
    </div>
  );
}
