import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import Preloader from "./PreLoader";
import { REACT_APP_FOOTBALL_API_KEY } from "../setting";
import { Table, Tag, Flex, Layout, Breadcrumb, DatePicker } from "antd";
import MyHeader from "./Header";
import "./Leagues.css";

const LeagueMatchesPage = () => {
  const { leagueId } = useParams();
  const [matches, setMatches] = useState([]);
  const [dates, setDates] = useState([null, null]);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [loading, setLoading] = useState(true);
  const { Footer, Content } = Layout;
  const [title, setTitle] = useState(" ");
  const { RangePicker } = DatePicker;

  const STATUS_TRANSLATOR = {
    SCHEDULED: "Запланирован",
    TIMED: "Запланирован",
    POSTPONED: "Перенесен",
    CANCELED: "Отменен",
    SUSPENDED: "Остановлен",
    IN_PLAY: "Идёт игра",
    LIVE: "Идёт трансляция",
    PAUSED: "Перерыв",
    AWARDED: "Идет награждение",
    FINISHED: "Игра окончена",
  };

  const handleFilterDates = (range) => {
    if (!range) {
      setDates([null, null]);
    } else {
      setDates(range);
    }
  };

  const fetchMatches = async () => {
    setLoading(true);
    console.log("выбранные даты:", startDate, endDate);
    const params = {};
    if (dates[0] && dates[1]) {
      params.dateFrom = dates[0].format("YYYY-MM-DD");
      params.dateTo = dates[1].format("YYYY-MM-DD");
    }
    try {
      const response = await axios.get(
        `http://localhost:8080/v4/competitions/${leagueId}/matches/`,
        {
          headers: { "X-Auth-Token": REACT_APP_FOOTBALL_API_KEY },
          params: params,
        }
      );
      console.log("ответ API:", response.data);

      //форматирование даты
      const formatDate = (dateString) => {
        const [date] = dateString.split("T"); //Используем только первую часть до 'T'
        const options = { day: "2-digit", month: "2-digit", year: "numeric" };
        return new Date(date).toLocaleDateString("ru-RU", options);
      };
      //форматирование времени
      const formatTime = (timeString) => {
        const [date, time] = timeString.split("T"); // Отбрасываем часть с Z
        const [hours, minutes] = time.split(":"); // Оставляем только часы и минуты
        return `${hours}:${minutes}`;
      };

      const matchData = response.data.matches.map((match) => ({
        key: match.id,
        date: match.utcDate ? formatDate(match.utcDate) : null,
        time: match.utcDate ? formatTime(match.utcDate) : null,
        state: match.status,
        tags: [match.status],
        translatedStatus: STATUS_TRANSLATOR[match.status],
        homeTeam: match.homeTeam.name,
        awayTeam: match.awayTeam.name,
        score: {
          fullTime:
            match.score.fullTime.home !== null &&
            match.score.fullTime.away !== null
              ? `${match.score.fullTime.home} - ${match.score.fullTime.away}`
              : "-",
        },
        homeTeamId: match.homeTeam.id,
        awayTeamId: match.awayTeam.id,
      }));

      console.log("Данные массива для таблицы:", matchData);
      setTitle(response.data.competition.name);
      setMatches(matchData);
    } catch (err) {
      console.error("Error fetching matches", err);
    } finally {
      setLoading(false); // выключаем индикатор загрузки в любом случае
    }
  };
  useEffect(() => {
    if (leagueId) {
      fetchMatches();
    }
  }, [leagueId]);

  useEffect(() => {
    fetchMatches();
  }, [dates]);

  const columns = [
    {
      title: "Дата",
      dataIndex: "date",
      key: "date",
    },
    {
      title: "Время",
      dataIndex: "time",
      key: "time",
    },
    {
      title: "Статус",
      dataIndex: "state",
      key: "state",
      render: (_, record) => {
        const state = record.translatedStatus;
        let color;
        if (state === "Запланирован" || state === "Отменен") {
          color = "gray";
        } else if (state === "Идёт трансляция" || state === "Идёт игра") {
          color = "volcano";
        } else if (
          state === "Перерыв" ||
          state === "Перенесен" ||
          state === "Остановлен"
        ) {
          color = "geekblue";
        } else if (state === "Игра окончена") {
          color = "green";
        } else {
          color = "gray";
        }
        return (
          <Tag color={color} key={record.key}>
            {state.toUpperCase()}
          </Tag>
        );
      },
    },
    {
      title: "Принимающая команда",
      dataIndex: "homeTeam",
      key: "homeTeam",
      render: (text, record) => (
        <Link to={`/team/${record.homeTeamId}`}>{text}</Link>
      ),
    },
    {
      title: "Гостевая команда",
      dataIndex: "awayTeam",
      key: "awayTeam",
      render: (text, record) => (
        <Link to={`/team/${record.awayTeamId}`}>{text}</Link>
      ),
    },
    {
      title: "Счёт",
      key: "score",
      render: (record) => (
        <>
          <div>{record.score.fullTime}</div>
        </>
      ),
        
    },
  ];

  return (
    <Flex gap="middle" wrap>
      <Layout>
        <MyHeader />
        <Content className="contentStyle">
          {loading ? (
            <Preloader />
          ) : (
            <>
              <Breadcrumb className="breadStyle">
                <Breadcrumb.Item>
                  <Link to="/">Все лиги </Link>
                </Breadcrumb.Item>
                <Breadcrumb.Item>Лига {title}</Breadcrumb.Item>
              </Breadcrumb>
              <h1>Календарь лиги {title}</h1>
              <RangePicker
                placeholder={["Искать от", "Искать до"]}
                value={dates}
                onChange={handleFilterDates}
              />
              <Table
                className="tableStyle"
                columns={columns}
                dataSource={matches}
              />
            </>
          )}
        </Content>
        <Footer className="footerStyle"></Footer>
      </Layout>
    </Flex>
  );
};
export default LeagueMatchesPage;
