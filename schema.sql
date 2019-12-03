CREATE DATABASE bamazon;


CREATE TABLE products(
		item_id integer not null auto_increment,
        product_name varchar(50) not null,
        department_name varchar(50) not null,
        price decimal(8,2) not null,
        stock_quantity integer(8) not null,
        primary key (item_id)
);
use bamazon;
insert into products (product_name,department_name,price,stock_quantity)
values ("Star Wars Legos","Games and Toys",40,70);