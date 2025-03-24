import { Button } from "@/components/ui/button"
import { getBoardBySlug } from "../../../../lib/boards"
import { PlusCircle } from "lucide-react"

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }> // Updated to use Promise
}) {
  const { slug } = await params // Added await here

  console.log("Slug parameter:", slug)

  const board = await getBoardBySlug(slug)

  console.log("Board data:", board)

  if (!board) {
    return (
      <div className="p-8">
        <h2 className="text-2xl font-bold">Board not found</h2>
        <p>No board found with slug: {slug}</p>
      </div>
    )
  }

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold">{board.name}</h2>
      {board.columns.length < 1 ? (
        <NoColumnsFound />
      ) : (
        <ul className="mt-4 space-y-4">
          {board.columns?.map((column) => (
            <li key={column.id} className="p-4 border rounded-md">
              <h3 className="text-lg font-semibold">{column.name}</h3>
              <ul className="mt-2 space-y-2">
                {column.tasks?.map((task) => (
                  <li key={task.id} className="p-2 bg-gray-100 rounded">
                    {task.title}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

function NoColumnsFound() {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center border rounded-lg bg-muted/20">
      <h2 className="sr-only">No columns found</h2>
      <p className="text-muted-foreground mb-6">This board is empty. Create a new column to get started</p>
      <Button>
        <PlusCircle className="mr-2 h-4 w-4" />
        Add New Column
      </Button>
    </div>
  )
}