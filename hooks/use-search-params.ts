import { useQueryState, parseAsString, parseAsInteger } from 'nuqs';

export function useSearchParams() {
  const [search, setSearch] = useQueryState('q', parseAsString);
  const [page, setPage] = useQueryState('page', parseAsInteger.withDefault(1));

  return {
    search,
    setSearch,
    page,
    setPage,
  };
}
