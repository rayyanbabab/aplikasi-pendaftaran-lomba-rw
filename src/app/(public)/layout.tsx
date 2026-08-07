import { SiteFooter } from "@/components/site/footer";
import { SiteHeader } from "@/components/site/header";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col overflow-x-hidden w-full relative">
      <SiteHeader />
      <div className="flex-1 w-full overflow-x-hidden">{children}</div>
      <SiteFooter />
    </div>
  );
}
