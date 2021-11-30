import React from 'react';
import { useState, useEffect } from 'react'
import ReactPaginate from 'react-paginate';
//Пагинация
//вывод таблицы
function ВogsDataTable(dogsData) {
  return dogsData && dogsData.length > 0
    ? dogsData.map((item) => (
      < tr key={item.title} >
        <td key={item.title}>{item.title}</td>
        <td key={item.image}><img src={item.image} className="user-image" alt="" /></td>
        <td key={item.breed}>{item.breed}</td>
      </tr >
    ))
    : null
}
// const items = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];

function Items({ currentItems }) {
  return ВogsDataTable(currentItems)
}
export const PaginatedItems = ({ itemsPerPage, filteredData1 }) => {
  console.log('filteredData1=', filteredData1)
  const items = filteredData1;

  // We start with an empty list of items.
  const [currentItems, setCurrentItems] = useState(null);
  const [pageCount, setPageCount] = useState(0);
  // Here we use item offsets; we could also use page offsets
  // following the API or data you're working with.
  const [itemOffset, setItemOffset] = useState(0);

  useEffect(() => {
    // Fetch items from another resources.
    const endOffset = itemOffset + itemsPerPage;
    console.log(`Loading items from ${itemOffset} to ${endOffset}`);
    setCurrentItems(items.slice(itemOffset, endOffset));
    setPageCount(Math.ceil(items.length / itemsPerPage));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [itemOffset, itemsPerPage, filteredData1]);

  // Invoke when user click to request another page.
  const handlePageClick = (event) => {
    const newOffset = event.selected * itemsPerPage % items.length;
    console.log(`User requested page number ${event.selected}, which is offset ${newOffset}`);
    setItemOffset(newOffset);
  };

  return (
    <>
      {/* <Items currentItems={currentItems} /> */}
      <ReactPaginate
        nextLabel="next >"
        onPageChange={handlePageClick}
        pageRangeDisplayed={5}
        pageCount={pageCount}
        previousLabel="< previous"
        pageClassName="page-item"
        pageLinkClassName="page-link"
        previousClassName="page-item"
        previousLinkClassName="page-link"
        nextClassName="page-item"
        nextLinkClassName="page-link"
        breakLabel="..."
        breakClassName="page-item"
        breakLinkClassName="page-link"
        containerClassName="pagination"
        activeClassName="active"
        renderOnZeroPageCount={null}
      />
      <table className="table striped">
        <thead>
          <tr>
            <th>Заголовок</th>
            <th>Картинка</th>
            <th>Порода</th>
          </tr>
        </thead>
        <tbody>
          {/* {ВogsDataTable(filteredData)} */}
          <Items currentItems={currentItems} />
        </tbody>
      </table>
    </>
  );
}
