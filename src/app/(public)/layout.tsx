import Navbar01 from "@/components/common/landing/navbar";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar01 />
      <main className="mx-auto w-full max-w-7xl px-4 md:px-6 py-8 bg-white">
        {children}
      </main>
    </>
  );
}
