import { Show, For, createSignal, createEffect } from "solid-js";
import { useLogs, ItemLog } from "../hooks/useLogs";
import LogsDataTable from "../components/logs.data-table";

export default function LogsPage() {
  const logs = useLogs();
  const [view, setView] = createSignal<'card' | 'table'>('card');
  const [actionFilter, setActionFilter] = createSignal<string>("");
  const [itemFilter, setItemFilter] = createSignal<string>("");
  const [userFilter, setUserFilter] = createSignal<string>("");

  // Search state
  const [search, setSearch] = createSignal("");

  // Compute filtered logs (with search)
  const filteredLogs = () => {
    if (!logs.data) return [];
    let result = logs.data.filter(log =>
      (!actionFilter() || log.action === actionFilter()) &&
      (!itemFilter() || log.item_name === itemFilter()) &&
      (!userFilter() || log.user_name === userFilter())
    );
    if (search().trim()) {
      const q = search().toLowerCase();
      result = result.filter(log => {
        const fields = [
          log.item_name,
          log.user_name,
          log.action,
          log.note,
          JSON.stringify(log.before),
          JSON.stringify(log.after)
        ];
        return fields.some(f => f && f.toLowerCase().includes(q));
      });
    }
    return result;
  };

  // Pagination state
  const [page, setPage] = createSignal(1);
  const [pageSize, setPageSize] = createSignal(10);
  const totalPages = () => Math.max(1, Math.ceil(filteredLogs().length / pageSize()));
  const paginatedLogs = () => {
    const start = (page() - 1) * pageSize();
    return filteredLogs().slice(start, start + pageSize());
  };
  const goToPage = (p: number) => setPage(Math.max(1, Math.min(p, totalPages())));

  // Reset page when filter or search changes
  createEffect(() => { setPage(1); }, [actionFilter, itemFilter, userFilter, search, pageSize]);

  // Unique values for filters
  const actionOptions = () => Array.from(new Set((logs.data || []).map(l => l.action))).filter(Boolean);
  const itemOptions = () => Array.from(new Set((logs.data || []).map(l => l.item_name))).filter(Boolean);
  const userOptions = () => Array.from(new Set((logs.data || []).map(l => l.user_name))).filter(Boolean);

  const resetPage = () => {
    // implement reset page logic here
  };

  return (
    <div class="p-8 space-y-6">
      <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
        <h1 class="text-2xl font-bold text-sidebar">Log Perubahan Item</h1>
        <div class="flex gap-1 mt-2 md:mt-0 bg-blue-50 rounded-full p-1 border border-blue-200 shadow-sm">
          <button
            class={`flex items-center gap-1 px-5 py-2 rounded-full text-sm font-semibold transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-blue-400 ${view() === 'card' ? 'bg-blue-600 text-white shadow' : 'bg-transparent text-blue-700 hover:bg-blue-100'}`}
            aria-selected={view() === 'card'}
            onClick={() => setView('card')}
            tabIndex={0}
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7" rx="2" /><rect x="14" y="3" width="7" height="7" rx="2" /><rect x="14" y="14" width="7" height="7" rx="2" /><rect x="3" y="14" width="7" height="7" rx="2" /></svg>
            Card
          </button>
          <button
            class={`flex items-center gap-1 px-5 py-2 rounded-full text-sm font-semibold transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-blue-400 ${view() === 'table' ? 'bg-blue-600 text-white shadow' : 'bg-transparent text-blue-700 hover:bg-blue-100'}`}
            aria-selected={view() === 'table'}
            onClick={() => setView('table')}
            tabIndex={0}
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M4 6h16M4 12h16M4 18h16" /></svg>
            Table
          </button>
        </div>
      </div>
      <Show when={logs.isLoading}>Loading...</Show>
      <Show when={logs.error}>Gagal memuat data log</Show>
      {/* Search bar */}
      <div class="flex flex-wrap gap-2 items-center mb-2">
        <div class="relative w-full max-w-xs">
          <input
            type="text"
            class="w-full pl-9 pr-3 py-2 rounded-lg border border-blue-200 focus:ring-2 focus:ring-blue-400 focus:outline-none text-sm bg-white shadow-sm"
            placeholder="Cari log..."
            value={search()}
            onInput={e => setSearch(e.currentTarget.value)}
          />
          <span class="absolute left-2 top-2.5 text-blue-400">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" /></svg>
          </span>
        </div>
      </div>
      <Show when={logs.data && logs.data.length > 0} fallback={<div class="text-center text-gray-400">Tidak ada log perubahan.</div>}>
        {/* Filters */}
        <div class="flex flex-wrap gap-4 items-end bg-white rounded-xl p-4 border border-gray-200 shadow-sm mt-2">
          <div class="flex flex-col">
            <label class="block text-xs font-semibold mb-1 text-blue-900">Aksi</label>
            <select class="border-2 border-blue-200 rounded-lg px-3 py-2 text-sm bg-white focus:ring-2 focus:ring-blue-400 transition" value={actionFilter()} onInput={e => { setActionFilter(e.currentTarget.value); resetPage(); }}>
              <option value="">Semua</option>
              <For each={actionOptions()}>{option => <option value={option}>{option}</option>}</For>
            </select>
          </div>
          <div class="flex flex-col">
            <label class="block text-xs font-semibold mb-1 text-blue-900">Barang</label>
            <select class="border-2 border-blue-200 rounded-lg px-3 py-2 text-sm bg-white focus:ring-2 focus:ring-blue-400 transition" value={itemFilter()} onInput={e => { setItemFilter(e.currentTarget.value); resetPage(); }}>
              <option value="">Semua</option>
              <For each={itemOptions()}>{option => <option value={option}>{option}</option>}</For>
            </select>
          </div>
          <div class="flex flex-col">
            <label class="block text-xs font-semibold mb-1 text-blue-900">User</label>
            <select class="border-2 border-blue-200 rounded-lg px-3 py-2 text-sm bg-white focus:ring-2 focus:ring-blue-400 transition" value={userFilter()} onInput={e => { setUserFilter(e.currentTarget.value); resetPage(); }}>
              <option value="">Semua</option>
              <For each={userOptions()}>{option => <option value={option}>{option}</option>}</For>
            </select>
          </div>
          <div class="ml-auto flex gap-2">
            <button
              class="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 text-xs font-semibold border border-blue-200 shadow"
              onClick={() => { setActionFilter(""); setItemFilter(""); setUserFilter(""); resetPage(); }}
            >Reset</button>
          </div>
        </div>
        <Show when={view() === 'card'}>
          <div class="flex flex-col gap-6 mt-4">
            <For each={paginatedLogs()}>
              {(log: ItemLog) => (
                <div class="bg-white rounded-lg shadow p-6 border border-gray-100">
                  <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-2">
                    <div class="flex flex-wrap items-center gap-2">
                      <span class={`px-2 py-1 rounded text-xs font-semibold ${log.action === 'create' ? 'bg-green-100 text-green-700' :
                          log.action === 'update' ? 'bg-yellow-100 text-yellow-700' :
                            log.action === 'delete' ? 'bg-red-100 text-red-700' :
                              'bg-gray-100 text-gray-700'}`}>{log.action}</span>
                      <span class="font-semibold text-lg">{log.item_name ?? '-'}</span>
                      <span class="text-sm text-gray-500">oleh <span class="font-medium text-gray-700">{log.user_name ?? '-'}</span></span>
                    </div>
                    <span class="text-xs text-gray-400">{new Date(log.created_at).toLocaleString()}</span>
                  </div>
                  {log.note && (
                    <div class="mb-2"><span class="inline-block bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded">{log.note}</span></div>
                  )}
                  <div class="flex flex-col md:flex-row gap-4">
                    <div class="flex-1">
                      <div class="font-semibold mb-1 text-gray-600">Before</div>
                      <div class="bg-gray-50 rounded p-2 border border-gray-200 text-xs overflow-x-auto whitespace-pre-wrap min-h-[48px]">
                        {log.before ? <pre>{JSON.stringify(log.before, null, 2)}</pre> : <span class="text-gray-400">-</span>}
                      </div>
                    </div>
                    <div class="flex-1">
                      <div class="font-semibold mb-1 text-gray-600">After</div>
                      <div class="bg-gray-50 rounded p-2 border border-gray-200 text-xs overflow-x-auto whitespace-pre-wrap min-h-[48px]">
                        {log.after ? <pre>{JSON.stringify(log.after, null, 2)}</pre> : <span class="text-gray-400">-</span>}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </For>
            {/* Pagination controls */}
            <div class="flex flex-wrap items-center justify-between gap-2 mt-6">
              <div class="text-xs text-gray-500">
                Menampilkan {filteredLogs().length === 0 ? 0 : ((page() - 1) * pageSize() + 1)}–{Math.min(page() * pageSize(), filteredLogs().length)} dari {filteredLogs().length} data
              </div>
              <div class="flex items-center gap-1">
                <button class="px-2 py-1 rounded disabled:opacity-50" onClick={() => goToPage(page() - 1)} disabled={page() <= 1}>&lt;</button>
                <For each={Array.from({ length: totalPages() }, (_, i) => i + 1)}>{p =>
                  <button class={`px-3 py-1 rounded ${page() === p ? 'bg-blue-600 text-white font-bold' : 'bg-gray-100 text-gray-700'}`} onClick={() => goToPage(p)}>{p}</button>
                }</For>
                <button class="px-2 py-1 rounded disabled:opacity-50" onClick={() => goToPage(page() + 1)} disabled={page() >= totalPages()}>&gt;</button>
                <select class="ml-2 border rounded px-2 py-1 text-xs" value={pageSize()} onInput={e => setPageSize(Number(e.currentTarget.value))}>
                  {[5, 10, 20, 50, 100].map(size => <option value={size}>{size} / halaman</option>)}
                </select>
              </div>
            </div>
          </div>
        </Show>
        <Show when={view() === 'table'}>
          <LogsDataTable logs={filteredLogs()} />
        </Show>
      </Show>
    </div>
  );
}
