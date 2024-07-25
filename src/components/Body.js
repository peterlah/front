import React, { useState, useEffect } from "react";
import axios from "axios";

const Body = () => {
  const [items, setItems] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [newItemName, setNewItemName] = useState("");
  const [newItemDescription, setNewItemDescription] = useState("");
  const [newItemPrice, setNewItemPrice] = useState("");

  useEffect(() => {
    fetchItems(page, limit);
  }, [page, limit]);

  // 전체 항목 조회
  const fetchItems = async (page, limit) => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/items`,
        {
          params: { page, limit },
        }
      );
      if (response.data && Array.isArray(response.data.items)) {
        setItems(response.data.items);
        setTotalItems(response.data.totalItems || 0); // 총 항목 수 설정
      } else {
        console.error("Invalid data format:", response.data);
        setItems([]);
        setTotalItems(0);
      }
    } catch (error) {
      console.error("Error fetching items:", error);
      setItems([]);
      setTotalItems(0);
    }
  };

   // 신규 아이템 추가
   const addItem = async (name, description, price) => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/items`, {
        name,
        description,
        price,
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      console.log("Added item:", response.data);
      fetchItems(page, limit); // 항목 갱신
    } catch (error) {
      console.error("Error adding item:", error);
    }
  };

    // 아이템 삭제
    const deleteItem = async (id) => {
        try {
          await axios.delete(`${process.env.REACT_APP_API_URL}/api/items/${id}`);
          console.log(`Deleted item with ID: ${id}`);
          fetchItems(page, limit); // 항목 갱신
        } catch (error) {
          console.error("Error deleting item:", error);
        }
      };

  // 폼 제출 핸들러
  const handleAddItem = (e) => {
    e.preventDefault();
    addItem(newItemName, newItemDescription, newItemPrice);
    setNewItemName("");
    setNewItemDescription("");
    setNewItemPrice("");
  };

  // 페이지 변경 핸들러
  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  return (
    <div>
      <h2>Item Management</h2>
      {/* 신규아이템 등록 UI */}
      <form onSubmit={handleAddItem}>
        <input
          type="text"
          placeholder="Item Name"
          value={newItemName}
          onChange={(e) => setNewItemName(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Item Description"
          value={newItemDescription}
          onChange={(e) => setNewItemDescription(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="Item Price"
          value={newItemPrice}
          onChange={(e) => setNewItemPrice(e.target.value)}
          required
        />
        <button type="submit">Add Item</button>
      </form>
      {/* 아이템리스트 */}
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Description</th>
            <th>Price</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id}>
              <td>{item.id}</td>
              <td>{item.name}</td>
              <td>{item.description}</td>
              <td>{item.price}</td>
              <td>
                <button onClick={() => deleteItem(item.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Pagination
        currentPage={page}
        totalItems={totalItems}
        itemsPerPage={limit}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

const Pagination = ({
  currentPage,
  totalItems,
  itemsPerPage,
  onPageChange,
}) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  if (totalPages === 1) return null;

  const handlePrevious = () => {
    if (currentPage > 1) onPageChange(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) onPageChange(currentPage + 1);
  };

  return (
    <div>
      <button onClick={handlePrevious} disabled={currentPage === 1}>
        Previous
      </button>
      <span>
        Page {currentPage} of {totalPages}
      </span>
      <button onClick={handleNext} disabled={currentPage === totalPages}>
        Next
      </button>
    </div>
  );
};

export default Body;
