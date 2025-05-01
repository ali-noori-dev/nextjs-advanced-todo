import { getListsWithCards } from "@/app/lib/data";
import { withCurrentUserPage } from "@/app/lib/middleware";
import { Board } from "@/app/ui/board";

export default async function HomePage() {
  const lists = await withCurrentUserPage(getListsWithCards);

  return <Board initialLists={lists} />;
}
