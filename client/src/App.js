import 'materialize-css';
import './App.css';

import { useState, useEffect } from 'react'
import Select from 'react-select';
import ReactPaginate from 'react-paginate';

const COUNT_PAGE = 20;
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

function PaginatedItems({ itemsPerPage, filteredData1 }) {
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
      <table className="table">
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
    </>
  );
}




function App() {
  //Состояния для select
  const [selectedOption, setSelectedOption] = useState(null);
  const [optionData, setOptionData] = useState(null);

  //Состояния для search
  const [dataFromServer, setDataFromServer] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [q, setQ] = useState("");

  //useEffect для select
  useEffect(() => {
    console.log('selectedOption=', selectedOption);
    if (selectedOption === null) {
    }
    else {
      console.log('selectedOption=====', selectedOption)
      console.log('selectedOption.title=====', selectedOption.title)
      console.log('filteredData-----', filteredData)
      setFilteredData(selectedOption.arrObj)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedOption]);

  //useEffect для отрисовки таблицы
  useEffect(() => {
    const getBooks = async () => {
      getData().then((data) => {
        console.log('hook=', data);

        setDataFromServer(data);
        setFilteredData(data);

        console.log('hook2=', data);
        // console.log('hook3=', data[0].breed);
        let dataSelect = data.map((item) => {
          return { value: item.breed, label: item.breed, arrObj: [item] }
        })
        console.log('dataSelect=', dataSelect)
        setOptionData(dataSelect);
        console.log('selectedOption=', selectedOption)
      })
    };

    getBooks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  //useEffect для search
  useEffect(() => {
    filtered(q);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q]);

  const filtered = (e) => {
    const filtered =
      dataFromServer &&
      dataFromServer.filter((item) => {
        return item.title.toLowerCase().startsWith(e.toLowerCase());
      });
    setFilteredData(filtered);
  };

  // запрос Dog API
  const getData = async () => {
    try {
      const response = await fetch('/api/message/dogs');
      return await response.json();
    } catch (e) { console.log(e) }
  }

  return (
    <>
      <main>
        <div className="container">
          <div className="container-fluid padding">
            <div className="row">
              {/* <div className="col s3"></div> */}
              <div className="col s6 text-center">
                <h2 className="text-center ">Породы собак</h2>
                <div className="input-group ">
                  <p className="text-muted">Поиск по заголовку</p>
                  <input
                    type="search"
                    className="form-control rounded"
                    placeholder="Search"
                    value={q}
                    onChange={(e) => {
                      setQ(e.target.value);
                    }}
                  />
                    Поиск по породе select
                  <Select className='mySelect'
                    defaultValue={selectedOption}
                    onChange={setSelectedOption}
                    options={optionData}
                  />
                  <button type="button" className="btn btn-primary" onClick={() => {
                    console.log('button2');
                    setFilteredData(dataFromServer);
                  }
                  }>Сбросить поиск
                  </button>

                </div>
                {/* <table className="table">
                  <thead>
                    <tr>
                      <th>Заголовок</th>
                      <th>Картинка</th>
                      <th>Порода</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ВogsDataTable(filteredData)}
                  </tbody>
                </table> */}
                <PaginatedItems itemsPerPage={COUNT_PAGE} filteredData1={filteredData} />
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

export default App;
