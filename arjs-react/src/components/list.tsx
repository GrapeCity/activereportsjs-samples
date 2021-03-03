import { ListProps } from "../types";

export const List = ({
  items,
  currentItemIndex,
  selectionChanged,
  title,
}: ListProps) => {
  return (
    <>
      <h5 className="list-title">{title}</h5>
      <ul className="list">
        {items.map((item, index) => (
          <li
            key={`${item}_${index}`}
            className={`list-item ${
              index === currentItemIndex ? "active gc-accent-color" : ""
            }`}
            onClick={() => {selectionChanged(index)}}
          >
            {item}
          </li>
        ))}
      </ul>
    </>
  );
};
