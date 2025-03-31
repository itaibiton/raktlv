
export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (<>
        {children}
    </>
        // <html>
        //     <body>
        //         {children}
        //     </body>
        // </html>
    )
} 