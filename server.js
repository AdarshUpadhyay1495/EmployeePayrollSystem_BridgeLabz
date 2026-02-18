const express = require('express');
const fileHandler = require('./modules/fileHandler');

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.set('view engine', 'ejs');


app.get('/', async (req, res) => {
  const employees = await fileHandler.read();
  res.render('index', { employees });
});


app.get('/add', (req, res) => {
  res.render('add');
});

app.post('/add', async (req, res) => {
  const employees = await fileHandler.read();
  const { name, email, salary, department } = req.body;
  
  const newEmployee = {
    id: employees.length > 0 ? Math.max(...employees.map(e => e.id)) + 1 : 1,
    name,
    email,
    salary: Number(salary),
    department
  };
  
  employees.push(newEmployee);
  await fileHandler.write(employees);
  res.redirect('/');
});


app.get('/edit/:id', async (req, res) => {
  const employees = await fileHandler.read();
  const employee = employees.find(e => e.id == req.params.id);
  
  if (!employee) {
    return res.status(404).send('Employee not found');
  }
  
  res.render('edit', { employee });
});


app.post('/edit/:id', async (req, res) => {
  const employees = await fileHandler.read();
  const { name, email, salary, department } = req.body;
  
  const employee = employees.find(e => e.id == req.params.id);
  if (employee) {
    employee.name = name;
    employee.email = email;
    employee.salary = Number(salary);
    employee.department = department;
  }
  
  await fileHandler.write(employees);
  res.redirect('/');
});


app.get('/delete/:id', async (req, res) => {
  let employees = await fileHandler.read();
  employees = employees.filter(e => e.id != req.params.id);
  await fileHandler.write(employees);
  res.redirect('/');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});