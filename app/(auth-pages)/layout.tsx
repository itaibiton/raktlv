export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="w-full h-full flex flex-col gap-12 items-center justify-center pb-32">{children}</div>
  );
}
