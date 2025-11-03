export default function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params?: { slug?: string[] };
}) {
  const lang = params?.slug?.[0] === 'ar' ? 'ar' : 'en';

  return (
         <> {children} </>
  );
}
