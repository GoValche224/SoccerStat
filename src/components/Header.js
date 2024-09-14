import React from "react";
import { Link } from "react-router-dom";
import { Layout, Menu } from "antd";
import logo from '../logo.png';
import "./Leagues.css";

const MyHeader = () => {
const { Header } = Layout;

const items = [
    {
    key: 1,
    label:  <Link to={`/`}>Лиги</Link>,
   },
{
    key: 2,
    label: <Link to={`/teams/`}>Команды</Link>,
    },
];

  return (
    <Header className="headerStyle">
      <div className="logo">
        <img src={logo}  />
      </div>
      <Menu
        mode="horizontal"
        items={items}
        theme="light"
        style={{ flex: 1, minWidth: 0 }}
      />
    </Header>
  );
};

export default MyHeader;