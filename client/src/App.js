import 'materialize-css';
import './App.css';

import { useState, useEffect } from 'react'
import Select from 'react-select';
import { PaginatedItems } from './components/PaginatedItems';
const COUNT_PAGE = 20;

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
    if (selectedOption !== null) {
      console.log('selectedOption=====', selectedOption)
      console.log('selectedOption.title=====', selectedOption.title)
      console.log('filteredData-----', filteredData)
      setFilteredData(selectedOption.arrObj)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedOption]);

  //useEffect для отрисовки таблицы
  useEffect(() => {
    getData().then((data) => {
      console.log('hook=', data);

      setDataFromServer(data);
      setFilteredData(data);
      let dataSelect = data.map((item) => {
        return { value: item.breed, label: item.breed, arrObj: [item] }
      })
      console.log('dataSelect=', dataSelect)
      setOptionData(dataSelect);
      console.log('selectedOption=', selectedOption)
    })
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
              <div className="col s6 text-center">
                <h1 className="text-center ">Породы собак</h1>
                <div className="input-group ">
                  <p className="text-muted">Поиск по заголовку</p>
                  <input
                    type="search"
                    className="form-control rounded"
                    id="textInput"
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
                    setQ(''); // очищаем поле ввода
                    setFilteredData(dataFromServer);// сбрасываем отображение в таблице выбранной из  select породы
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
