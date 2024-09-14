import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Preloader from "./PreLoader";
import Paginator from "./Paginator";
import { REACT_APP_FOOTBALL_API_KEY } from "../setting";
import { Flex, Layout, Card, Input } from "antd";
import MyHeader from "./Header";
import "./Leagues.css";

const Leagues = () => {
  const [leagues, setLeagues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const { Meta } = Card;
  const { Footer, Content } = Layout;
  const { Search } = Input;
  const pageSize = 12; // сколько лиг на странице
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0); // общее количество лиг

  useEffect(() => {
    const fetchLeagues = async () => {
      setLoading(true); //включаем лоадер, пока данные загружаются
      try {
        const response = await axios.get(
          `http://localhost:8080/v4/competitions`,
          {
            headers: { "X-Auth-Token": REACT_APP_FOOTBALL_API_KEY },
          }
        ); //выполняем запрос к API
        setLeagues(response.data.competitions); // забираем данные из ответа
        setTotalItems(response.data.count); //устанавливаем количество элементов для пагинации
      } catch (error) {
        console.error("Error fetching data:", error);
      }
      setLoading(false); //выключаем лоадер
    };
    fetchLeagues();
  }, []); //т.к. API не поддерживает пагинацию и поиск, то все данные будут получены 1 раз

  const onInputChange = (event) => {
    setSearchQuery(event.target.value);
  }; //хранение поискового запроса, пока пользователь не нажмёт кнопку поиска

  const onSearch = (value) => {
    setSearch(value.toLowerCase()); //приведение поискового запроса  нижнему регистру
    setCurrentPage(1); // возвращает пользователя к первой странице после поиска
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  }; //функция для перехода между страницами

  const filteredLeagues = leagues.filter((league) =>
    league.name.toLowerCase().includes(search)
  ); //фильтрация лиг

  const indexOfLastItem = currentPage * pageSize;
  const indexOfFirstItem = indexOfLastItem - pageSize;
  const currentLeaguesOnPage = filteredLeagues.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  // устанавливаем totalItems на основе количества отфильтрованных элементов
  useEffect(() => {
    setTotalItems(filteredLeagues.length);
  }, [filteredLeagues]);

  return (
    <Flex gap="middle" wrap>
      <Layout>
        <MyHeader />
        <Content className="contentStyle">
          {loading ? (
            <Preloader />
          ) : (
            <>
              <h1>Лиги</h1>
              <Search
                className="search-input"
                placeholder="Введите название лиги"
                allowClear
                enterButton="Поиск"
                size="large"
                onChange={onInputChange}
                onSearch={onSearch}
                value={searchQuery}
              />

              <div className="ligues-list">
                {currentLeaguesOnPage.map((league) => (
                  <Link
                    className="league-card"
                    key={league.id}
                    to={`/league/${league.id}`}
                  >
                    <Card bordered={true}>
                      <p>
                        <img src={league.emblem} alt={`${league.name} logo`} />{" "}
                      </p>
                      <p>Страна: {league.area.name}</p>
                      <Meta title={league.name} />
                    </Card>
                  </Link>
                ))}
              </div>

              <Paginator
                currentPage={currentPage}
                onPageChange={handlePageChange}
                totalPages={totalItems}
              />
            </>
          )}
        </Content>
        <Footer className="footerStyle"></Footer>
      </Layout>
    </Flex>
  );
};

export default Leagues;
