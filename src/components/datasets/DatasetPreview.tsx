import React, {useMemo, useState} from 'react';
import {ChevronDown, ChevronUp, Loader2} from 'lucide-react';
import {useResource} from "../../hooks/useResource.ts";
import {datasetsApi} from "../../utils/api.ts";

interface Props {
  dataset: Dataset;
  onClose: () => void;
}

export default function DatasetPreview({dataset, onClose}: Props) {
  const [{loadedStart, loadedEnd}, setLoadRange] = useState<{ loadedStart: number, loadedEnd: number }>({
    loadedStart: 0,
    loadedEnd: 100
  });
  const [sortColumns, setSortColumns] = useState<string[]>([]);
  const [sortOrders, setSortOrders] = useState<string[]>([]);
  const [{data:{
    rows,
    total_count: totalCount
  }}, _, loading] = useResource(() => datasetsApi.preview(dataset.id, {
    startRow: loadedStart,
    endRow: loadedEnd,
    columns: dataset.columns,
    sortColumns,
    sortOrders
  }), [loadedStart, loadedEnd, sortColumns, sortOrders], {default: {data: {rows: [], total_count: 0}}});
  console.log('rows', rows, 'total_count', totalCount);
  const [currentPage, setCurrentPage] = useState(0);

  const itemsPerPage = 10;
  const totalPages = Math.ceil(totalCount / itemsPerPage);

  const pageStart = currentPage * itemsPerPage;
  const pageEnd = Math.min(totalCount, pageStart + itemsPerPage);

  const goToPage = (page: number) => {
    setCurrentPage(page);

    const pageStart = page * itemsPerPage;
    const pageEnd = Math.min(totalCount, pageStart + itemsPerPage);
    if (pageStart < loadedStart || pageEnd > loadedEnd) {
      setLoadRange({
        loadedStart: Math.max(0, pageStart - itemsPerPage * 10),
        loadedEnd: Math.min(totalCount, pageEnd + itemsPerPage * 10)
      })
    }
  }


  const handleSort = (key: string) => {
    const index = sortColumns.indexOf(key)
    const newDirection = index !== -1 ? sortOrders[index] == 'asc' ? 'desc' : '' : 'asc';
    let newColumns = [...sortColumns];
    let newOrders = [...sortOrders];
    if (index !== -1) {
      newColumns.splice(index, 1);
      newOrders.splice(index, 1);
    }
    if (newDirection !== '') {
      newColumns.unshift(key);
      newOrders.unshift(newDirection);
    }

    setSortColumns(newColumns);
    setSortOrders(newOrders);
  };

  const currentData = useMemo(() => {
    if (pageStart < loadedStart || pageEnd > loadedEnd) return []
    else return rows.slice(pageStart - loadedStart, pageEnd - loadedStart);
  }, [pageStart, pageEnd, loadedStart, loadedEnd, rows]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl max-h-[90vh] flex flex-col">
        <div className="p-4 border-b flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">{dataset.name}</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ×
          </button>
        </div>

        <div className="flex-1 overflow-auto">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <Loader2 className="w-8 h-8 text-primary-600 animate-spin"/>
            </div>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
              <tr>
                {dataset.columns.map((column) => (
                  <th
                    key={column}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort(column)}
                  >
                    <div className="flex items-center gap-1">
                      {column}
                      {sortColumns && (column === sortColumns[0]) && (
                        sortOrders[0] === 'asc' ?
                          <ChevronUp className="w-4 h-4"/> :
                          <ChevronDown className="w-4 h-4"/>
                      )}
                    </div>
                  </th>
                ))}
              </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
              {currentData.map((row, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  {row.map((entry, index) => (
                    <td key={index} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {entry}
                    </td>
                  ))}
                </tr>
              ))}
              </tbody>
            </table>
          )}
        </div>

        <div className="p-4 border-t flex items-center justify-between">
          <div className="text-sm text-gray-700">
            Showing {pageStart + 1} to {pageEnd} of {totalCount} entries
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 0}
              className="px-3 py-1 rounded border text-sm disabled:opacity-50"
            >
              Previous
            </button>
            <span className="text-sm text-gray-600">
              Page {currentPage + 1} of {totalPages}
            </span>
            <button
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage + 1 === totalPages}
              className="px-3 py-1 rounded border text-sm disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}