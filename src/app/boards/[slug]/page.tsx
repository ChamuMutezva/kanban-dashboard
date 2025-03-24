import { getBoardBySlug } from "../../../../lib/boards";

export default async function Page({
    params,
}: Readonly<{
    params: Promise<{ slug: string }>;
}>) {
    const { slug } = await params;
    console.log(slug);
    const boards = await getBoardBySlug(slug);
     console.log(boards?.columns);
    return (
        <div>
            <h2>{boards?.name}</h2>
            <ul>
                {boards?.columns.map((column) => (
                    <li key={column.id}>
                        <h3>{column.name}</h3>
                    </li>
                ))}
            </ul>
        </div>
    );
}
