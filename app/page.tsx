import { getListsWithCards } from "@/app/lib/data";
import { withCurrentUserPage } from "@/app/lib/middleware";
import { Board } from "@/app/ui/board";
import { Header } from "@/app/ui/layout";

export default async function HomePage() {
  const lists = await withCurrentUserPage(getListsWithCards);

  return (
    <>
      <Header />
      <Board initialLists={lists} />
    </>
  );
}
