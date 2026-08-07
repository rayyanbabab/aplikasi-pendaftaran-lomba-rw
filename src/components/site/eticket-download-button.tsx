"use client";

import * as React from "react";
import { Download, Printer, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

type Props = {
  ticketElementId: string;
  publicCode: string;
};

export function ETicketDownloadButton({ ticketElementId, publicCode }: Props) {
  const [isDownloading, setIsDownloading] = React.useState(false);
  const [isPrinting, setIsPrinting] = React.useState(false);

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      const html2canvas = (await import("html2canvas")).default;
      const element = document.getElementById(ticketElementId);
      if (!element) throw new Error("Elemen tiket tidak ditemukan");

      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff",
        logging: false,
      });

      const link = document.createElement("a");
      link.download = `E-Ticket-${publicCode}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
      toast.success("E-Ticket berhasil diunduh!");
    } catch (err) {
      console.error(err);
      toast.error("Gagal mengunduh E-Ticket. Coba lagi.");
    } finally {
      setIsDownloading(false);
    }
  };

  const handlePrint = () => {
    setIsPrinting(true);
    setTimeout(() => {
      window.print();
      setIsPrinting(false);
    }, 300);
  };

  return (
    <div className="flex flex-col sm:flex-row gap-3 w-full">
      <Button
        type="button"
        onClick={handleDownload}
        disabled={isDownloading}
        className="flex-1 h-13 rounded-full bg-[#ee2b2b] text-white font-bold text-sm shadow-lg shadow-red-500/25 hover:bg-[#d42222] transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60"
      >
        {isDownloading ? (
          <><Loader2 className="mr-2 h-5 w-5 animate-spin" />Mengunduh...</>
        ) : (
          <><Download className="mr-2 h-5 w-5" />Unduh E-Ticket (PNG)</>
        )}
      </Button>

      <Button
        type="button"
        onClick={handlePrint}
        disabled={isPrinting}
        variant="outline"
        className="flex-1 h-13 rounded-full border-2 border-border font-bold text-sm transition-all duration-200 hover:border-primary/50 hover:text-primary hover:bg-primary/5"
      >
        {isPrinting ? (
          <><Loader2 className="mr-2 h-5 w-5 animate-spin" />Menyiapkan...</>
        ) : (
          <><Printer className="mr-2 h-5 w-5" />Cetak E-Ticket</>
        )}
      </Button>
    </div>
  );
}
