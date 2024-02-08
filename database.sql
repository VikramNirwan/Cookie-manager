SHOW DATABASES;
CREATE DATABASE CLICKSTREAM;
USE CLICKSTREAM;

SHOW TABLES;
CREATE TABLE DATA(
ID INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
panelid text not null ,
referer text not null,
url text not null
);
desc data;

ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'Qwerty@12345';

select * from data;
