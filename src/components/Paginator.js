import React from "react";
import { Pagination } from "antd";

const Paginator = ({ currentPage, onPageChange, totalPages }) => {
  return (
    <>
      <Pagination
        className="pagination"
        current={currentPage} // Текущая страница
        total={totalPages} // Общее количество страниц
        onChange={onPageChange} // Функция, вызываемая при изменении страницы
      />
    </>
  );
};

export default Paginator;
