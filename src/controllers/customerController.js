import { pool } from "../db.js";

import fs from 'fs';

import path from 'path';

export const renderCustomers = async (req, res) => {
  const [rows] = await pool.query("SELECT * FROM customer");
  res.render("customers", { customers: rows });
};

export const createCustomers = async (req, res) => {
  const newCustomer = req.body;
  
  // Assuming newCustomer object has a 'username' property
  const { name } = newCustomer;

  // Insert the new customer into the database
  await pool.query("INSERT INTO customer SET ?", [newCustomer]);

  // Create the directory if it doesn't exist
  const userDirectory = '/data/users/';
  if (!fs.existsSync(userDirectory)) {
    fs.mkdirSync(userDirectory, { recursive: true });
  }

  // Create a file with the username in /data/users/ location
  const filePath = `/data/users/${name}.txt`;
  const fileContent = `This file belongs to user: ${name}\n`; // You can customize the file content if needed

  fs.writeFile(filePath, fileContent, (err) => {
    if (err) {
      console.error('Error creating the user file:', err);
    } else {
      console.log('User file created successfully!');
    }
  });

  res.redirect("/");
};


export const editCustomer = async (req, res) => {
  const { id } = req.params;
  const [result] = await pool.query("SELECT * FROM customer WHERE id = ?", [
    id,
  ]);
  res.render("customers_edit", { customer: result[0] });
};

export const updateCustomer = async (req, res) => {
  const { id } = req.params;
  const newCustomer = req.body;
  await pool.query("UPDATE customer set ? WHERE id = ?", [newCustomer, id]);
  res.redirect("/");
};

export const deleteCustomer = async (req, res) => {
  const { id } = req.params;
  const result = await pool.query("DELETE FROM customer WHERE id = ?", [id]);
  if (result.affectedRows === 1) {
    res.json({ message: "Customer deleted" });
  }
  res.redirect("/");
};
