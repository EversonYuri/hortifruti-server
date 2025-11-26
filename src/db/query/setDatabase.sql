CREATE DATABASE IF NOT EXISTS store_db
  DEFAULT CHARACTER SET utf8mb4
  DEFAULT COLLATE utf8mb4_general_ci;

Create table if not exists store_db.events (
    id int primary key auto_increment,
    event_type varchar(255) not null,
    product_id varchar(255) not null,
    quantity int not null,
    price decimal(10, 2) not null,
    event_date datetime not null,
    created_at timestamp not null default current_timestamp
);

Create table if not exists store_db.configuration (
    id int primary key auto_increment,
    version varchar(255) not null DEFAULT '0.1.0',
    updated_at timestamp not null default current_timestamp,
    created_at timestamp not null default current_timestamp
);

Create Table if not exists store_db.grupos (
    id int primary key auto_increment,
    nome varchar(255) not null,
    created_at timestamp not null default current_timestamp
);

Create Table if not exists store_db.subgrupos (
    id int primary key auto_increment,
    nome varchar(255) not null,
    created_at timestamp not null default current_timestamp
);
INSERT INTO store_db.configuration (version) VALUES ('0.1.0');