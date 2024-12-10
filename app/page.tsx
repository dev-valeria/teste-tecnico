"use client";

import { useState, useEffect } from "react";
import DataGrid from "devextreme-react/data-grid";
import TreeList from "devextreme-react/tree-list";

interface Item {
  id: number;
  name: string;
  value: number;
  parentId: number | null;
}

const initialData = [
  { id: 1, name: "Item 1", value: 100, parentId: null },
  { id: 2, name: "Item 2", value: 200, parentId: 1 },
  { id: 3, name: "Item 3", value: 300, parentId: 1 },
];

export default function Home() {
  const [theme, setTheme] = useState("light");
  const [view, setView] = useState("DataGrid");
  const [data, setData] = useState(initialData);
  const [modalOpen, setModalOpen] = useState(false);
  const [editItem, setEditItem] = useState<Item | null>(null);

  useEffect(() => {
    const storedTheme = localStorage.getItem("theme") || "light";
    setTheme(storedTheme);
    document.documentElement.classList.toggle("dark", storedTheme === "dark");
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
    localStorage.setItem("theme", newTheme);
  };

  const toggleView = () => {
    setView((prev) => (prev === "DataGrid" ? "TreeList" : "DataGrid"));
  };

 const handleSave = (item: Item) => {
  if (item.id) {
    // Atualizar
    setData((prev) =>
      prev.map((d) => (d.id === item.id ? { ...d, ...item } : d))
    );
  } else {
    // Criar
    setData((prev) => [...prev, item]);
  }
  setModalOpen(false);
  setEditItem(null);
};
  const handleEdit = (row: Item) => {
    setEditItem(row);
    setModalOpen(true);
  };

  const handleDelete = (id: number) => {
    if (confirm(`Are you sure you want to delete row with ID: ${id}?`)) {
      setData((prevData) => prevData.filter((item) => item.id !== id));
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6">
      <div className="flex gap-4 mb-6">
        <button
          onClick={toggleTheme}
          className="px-4 py-2 rounded-lg text-white bg-blue-500 dark:bg-yellow-500 dark:text-black transition"
        >
          {theme === "light" ? " Dark Mode" : " Light Mode"}
        </button>
        <button
          onClick={toggleView}
          className="px-4 py-2 rounded-lg text-white bg-green-500 dark:bg-purple-500 transition"
        >
          {view === "DataGrid" ? " Switch to Tree List" : " Switch to Data Grid"}
        </button>
        <button
          onClick={() => setModalOpen(true)}
          className="px-4 py-2 rounded-lg text-white bg-indigo-500 dark:bg-pink-500 transition"
        >
          ➕ Add New
        </button>
      </div>

      <h1 className="text-3xl font-bold mb-6">
        {view === "DataGrid" ? " Data Grid" : " Tree List"}
      </h1>

      <div>
        {view === "DataGrid" ? (
          <DataGrid
          aria-label="Custom DataGrid"
          className="modern-table"
            dataSource={data}
            keyExpr="id"
            showBorders
            columns={[
              { dataField: "id", caption: "ID", width: 100, alignment: "center" },
              { dataField: "name", caption: "NAME", alignment: "center" },
              { dataField: "value", caption: "VALUE", width: 120, alignment: "center" },
              {
                caption: "ACTIONS",
                cellTemplate: (container, options) => {
                  const rowData = options.data;
                  if (!rowData) return;
                   const actionContainer = document.createElement("div");
                    actionContainer.className = "flex justify-center gap-4";
                 const editButton = document.createElement("button");
          editButton.innerText = "Edit";
          editButton.className =
            "px-3 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition";
          editButton.onclick = () => handleEdit(rowData);

          const deleteButton = document.createElement("button");
          deleteButton.innerText = "Delete";
          deleteButton.className =
            "px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 transition";
          deleteButton.onclick = () => handleDelete(rowData.id);

          actionContainer.appendChild(editButton);
          actionContainer.appendChild(deleteButton);
          container.appendChild(actionContainer);
        },
      },
    ]}
  />
        ) : (
            <TreeList
            dataSource={data}
            keyExpr="id"
            parentIdExpr="parentId"
            showBorders
            className="modern-table"

            columns={[
              { dataField: "id", caption: "ID", width: 80, alignment: "center" },
              { dataField: "name", caption: "NAME", alignment: "center" },
              { dataField: "value", caption: "VALUE", width: 120, alignment: "center" },
              {
                caption: "ACTIONS",
                cellTemplate: (container, options) => {
                  const rowData = options.data;
                  if (!rowData) return;
                  container.innerHTML = `
                    <div class="flex justify-center gap-2">
                      <button class="px-3 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition">Edit</button>
                      <button class="px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 transition">Delete</button>
                    </div>
                  `;
                  container.querySelector("button:nth-child(1)")?.addEventListener("click", () => handleEdit(rowData));
                  container.querySelector("button:nth-child(2)")?.addEventListener("click", () => handleDelete(rowData.id));
                },
              },
            ]}
          />
        )}
      </div>

      {modalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2 className="text-xl font-bold">
                {editItem ? "Edit Item" : "Add New Item"}
              </h2>
              <button
                onClick={() => {
                  setModalOpen(false);
                  setEditItem(null);
                }}
                className="text-xl font-bold text-gray-600 dark:text-gray-300"
              >
                ✖
              </button>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const form = e.target as HTMLFormElement;
                const formData = new FormData(form);
                const item = Object.fromEntries(formData.entries());
                handleSave({
      id: editItem?.id || data.length + 1, 
      name: item.name as string,          
      value: Number(item.value),         
      parentId: editItem?.parentId || null, 
    });
              }}
            >
              <div className="flex flex-col gap-4">
                <input
                  type="text"
                  name="name"
                  defaultValue={editItem?.name || ""}
                  placeholder="Name"
                  required
                  className="p-2 border rounded"
                />
                <input
                  type="number"
                  name="value"
                  defaultValue={editItem?.value || ""}
                  placeholder="Value"
                  required
                  className="p-2 border rounded"
                />
              </div>
              <div className="modal-footer mt-4 flex justify-end gap-4">
                <button type="submit" className="px-4 py-2 rounded-lg text-white bg-green-500 text-white rounded hover:bg-green-600">
                  Save
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setModalOpen(false);
                    setEditItem(null);
                  }}
                  className="px-4 py-2 rounded-lg text-white bg-red-500 text-white rounded hover:bg-red-600"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

