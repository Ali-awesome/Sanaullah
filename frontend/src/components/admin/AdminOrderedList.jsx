import { FaGripVertical, FaChevronUp, FaChevronDown } from "react-icons/fa";

const smallButtonClass = "h-fit rounded-md border border-[#ddd] bg-white px-3 py-[6px]";
const dangerButtonClass = "h-fit rounded-md border border-[#c0392b] bg-white px-3 py-[6px] text-[#c0392b]";
const iconButtonClass =
  "flex h-7 w-7 items-center justify-center rounded-md border border-[#ddd] bg-white disabled:cursor-not-allowed disabled:opacity-40";

/**
 * The row shell (drag handle, move-up/down, Edit, Delete) shared by every
 * manually-orderable admin list — only the row's own content differs per
 * resource, supplied via `renderContent`. See useOrderedAdminResource for
 * the state/handlers this renders.
 */
export default function AdminOrderedList({ resource, itemLabel, renderContent }) {
  const { items, draggedId, setDraggedId, handleDragOver, handleDrop, move, startEdit, handleDelete } = resource;

  return (
    <>
      {items?.map((item, i) => (
        <div
          key={item.id}
          draggable
          onDragStart={() => setDraggedId(item.id)}
          onDragOver={handleDragOver(item.id)}
          onDrop={handleDrop}
          onDragEnd={() => setDraggedId(null)}
          className={`flex items-start justify-between gap-3 border-b border-[#f0f0f0] py-3 ${
            draggedId === item.id ? "opacity-40" : ""
          }`}
        >
          <div className="flex items-start gap-3">
            <FaGripVertical className="mt-1 shrink-0 cursor-grab text-[#bbb] active:cursor-grabbing" aria-hidden="true" />
            {renderContent(item)}
          </div>
          <div className="flex shrink-0 gap-[8px]">
            <button
              className={iconButtonClass}
              onClick={() => move(i, -1)}
              disabled={i === 0}
              aria-label={`Move ${itemLabel(item)} up`}
            >
              <FaChevronUp />
            </button>
            <button
              className={iconButtonClass}
              onClick={() => move(i, 1)}
              disabled={i === items.length - 1}
              aria-label={`Move ${itemLabel(item)} down`}
            >
              <FaChevronDown />
            </button>
            <button className={smallButtonClass} onClick={() => startEdit(item)}>
              Edit
            </button>
            <button className={dangerButtonClass} onClick={() => handleDelete(item.id)}>
              Delete
            </button>
          </div>
        </div>
      ))}
    </>
  );
}
