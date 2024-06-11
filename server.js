import express from 'express';
const server = express();
const port = 3000;
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import i18n from 'i18n';
import dotenv from 'dotenv';
import pkg from 'pg';
const { Client } = pkg;

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

i18n.configure({
  locales: ['en', 'uk'],
  directory: path.join(__dirname, 'public', 'locales'),
  defaultLocale: 'en',
  cookie: 'locale',
  queryParameter: 'lang',
  autoReload: true,
  updateFiles: false,
});

server.set('view engine', 'ejs');

server.use(bodyParser.urlencoded({ extended: true }));
server.use(bodyParser.json());
server.use(cookieParser());
server.use(i18n.init);

server.use((req, res, next) => {
  res.locals.__ = res.__;
  res.locals.i18n = i18n;
  next();
});

server.use(express.static('public'));

const client = new Client({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
  encoding: process.env.DB_ENCODING,
});

client
  .connect()
  .then(() => console.log('Connected to the database'))
  .catch(err => console.error('Connection error', err.stack));

export default client;

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = 'public/img/desktop/';
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const baseName = path.basename(file.originalname, ext);
    cb(null, `${baseName}@1x${ext}`);
  },
});

const upload = multer({ storage: storage });

server.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const result = await client.query(
      'SELECT * FROM login_data WHERE email = $1 AND password = $2',
      [email, password]
    );

    if (result.rowCount > 0) {
      const employee = await client.query(
        'SELECT * FROM employees WHERE email = $1',
        [email]
      );
      const employeeRole = employee.rows[0].role;
      const employeeId = employee.rows[0].id;
      res.cookie('email', email);

      res.cookie('role', employeeRole);
      res.cookie('id', employeeId);
      res.redirect('/profile');
    } else {
      res.render('pages/login', { error: 'Invalid email or password' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
});

server.get('/profile', async (req, res) => {
  const email = req.cookies.email;
  const employeeId = req.cookies.id;

  try {
    const result = await client.query(
      'SELECT * FROM employees WHERE email = $1',
      [email]
    );

    if (result.rowCount > 0) {
      try {
        const employee = await client.query(
          'SELECT * FROM employees WHERE email = $1',
          [email]
        );

        const { technologyNames, percentages, colors } =
          await getEmployeeTechData(employeeId);
        const technologyChart = {
          technologyNames: JSON.stringify(technologyNames),
          percentages: JSON.stringify(percentages),
          colors: JSON.stringify(colors),
        };

        res.render('pages/profile', {
          currentPage: 'profile',
          employee: employee.rows[0],
          technologyChart,
          req: req,
        });
      } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
      }
    } else {
      res.redirect('/login');
    }
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
});

async function getEmployeeTechData(employeeId) {
  const query = `
    SELECT t.name, et.percentage, et.color
    FROM employee_technology et
    JOIN technologies t ON et.technology_id = t.technology_id
    WHERE et.employee_id = $1
  `;

  const { rows } = await client.query(query, [employeeId]);

  const technologyNames = [];
  const percentages = [];
  const colors = [];

  rows.forEach(({ name, percentage, color }) => {
    technologyNames.push(name);
    percentages.push(percentage);
    colors.push(color);
  });

  return { technologyNames, percentages, colors };
}

server.get('/profile/:name', async (req, res) => {
  const employeeName = req.params.name;

  try {
    const employee = await client.query(
      'SELECT * FROM employees WHERE name = $1',
      [employeeName]
    );

    const employeeId = employee.rows[0].id;
    const { technologyNames, percentages, colors } = await getEmployeeTechData(
      employeeId
    );
    const technologyChart = {
      technologyNames: JSON.stringify(technologyNames),
      percentages: JSON.stringify(percentages),
      colors: JSON.stringify(colors),
    };
    res.render('pages/profile', {
      currentPage: 'pages/profile',
      employee: employee.rows[0],
      technologyChart,
      req: req,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
});

server.put('/profile/update-email', async (req, res) => {
  const { email, id } = req.body;

  try {
    const updateEmployeeQuery = `
      UPDATE employees
      SET email = $1
      WHERE id = $2`;
    await client.query(updateEmployeeQuery, [email, id]);
    const updateLoginDataQuery = `
      UPDATE login_data
      SET email = $1
      WHERE id = $2`;
    await client.query(updateLoginDataQuery, [email, id]);

    const updateTasksQuery = `
      UPDATE tasks
      SET client_email = $1
      WHERE employee_id = $2`;
    await client.query(updateTasksQuery, [email, id]);
    res.status(200);
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).send('Internal Server Error');
  }
});
server.put('/profile/update-recent_project', async (req, res) => {
  const { recent, id } = req.body;

  try {
    const updateEmployeeQuery = `
      UPDATE employees
      SET recent_project = $1
      WHERE id = $2`;
    await client.query(updateEmployeeQuery, [recent, id]);

    res.status(200);
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).send('Internal Server Error');
  }
});

server.put('/profile/update-previous_project', async (req, res) => {
  const { previous, id } = req.body;

  try {
    const updateEmployeeQuery = `
      UPDATE employees
      SET previous_project = $1
      WHERE id = $2`;
    await client.query(updateEmployeeQuery, [previous, id]);
    res.status(200);
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).send('Internal Server Error');
  }
});

server.get('/settings', (req, res) => {
  res.render('pages/settings', {
    currentPage: 'settings',
  });
});
server.get('/', (req, res) => {
  res.render('pages/login', {
    currentPage: 'login',
  });
});

server.get('/clients', (req, res) => {
  client.query('SELECT * FROM team_members', (err, result) => {
    if (err) {
      console.error('Error fetching data from PostgreSQL:', err);
      res.status(500).send('Internal Server Error');
    } else {
      res.render('pages/clients', {
        currentPage: 'clients',
        teamMembers: result.rows,
        req: req,
      });
      console.log(`${result}`);
    }
  });
});

server.post('/add-client', upload.single('image'), async (req, res) => {
  const { team_member_name, company_name, image } = req.body;
  const imageName = req.file ? req.file.filename.split('@')[0] : null;
  try {
    console.log(imageName);
    await client.query(
      'INSERT INTO team_members (team_member_name, company_name, image_name) VALUES ($1, $2, $3)',
      [team_member_name, company_name, imageName]
    );
    console.log('Client added successfully');
    res.redirect('/clients');
  } catch (error) {
    console.error('Error inserting data into PostgreSQL:', error);
    res.status(500).send('Internal Server Error');
  }
});

server.get('/projects', (req, res) => {
  client.query('SELECT * FROM projects', (err, result) => {
    if (err) {
      console.error('Error fetching data from PostgreSQL:', err);
      res.status(500).send('Internal Server Error');
    } else {
      res.render('pages/projects', {
        currentPage: 'projects',
        projects: result.rows,
        req: req,
      });
      console.log(`${result}`);
    }
  });
});

server.post('/add-projects', async (req, res) => {
  const {
    project_name,
    project_manager,
    company,
    direction,
    status,
    description,
    team_members,
  } = req.body;

  const teamMembersArray = team_members.split(',').map(member => member.trim());
  const teamMembersString = `{${teamMembersArray
    .map(member => `"${member}"`)
    .join(',')}}`;

  try {
    await client.query(
      'INSERT INTO projects (project_name, project_manager, company, direction, status, description, team_members) VALUES ($1, $2, $3, $4, $5, $6, $7)',
      [
        project_name,
        project_manager,
        company,
        direction,
        status,
        description,
        teamMembersString,
      ]
    );
    console.log('Project added successfully');
    res.redirect('/projects');
  } catch (error) {
    console.error('Error inserting data into PostgreSQL:', error);
    res.status(500).send('Internal Server Error');
  }
});

server.get('/learnings', (req, res) => {
  client.query('SELECT * FROM learnings', (err, result) => {
    if (err) {
      console.error('Error fetching data from PostgreSQL:', err);
      res.status(500).send('Internal Server Error');
    } else {
      res.render('pages/learnings', {
        currentPage: 'learnings',
        learnings: result.rows,
        req: req,
      });
      console.log(`${result}`);
    }
  });
});

server.post('/add-learning', (req, res) => {
  const { learning_name, source, access_for } = req.body;

  client.query(
    'INSERT INTO learnings (learning_name, source, access_for) VALUES ($1, $2, $3)',
    [learning_name, source, access_for],
    (err, result) => {
      if (err) {
        console.error('Error inserting data into PostgreSQL:', err);
        res.status(500).send('Internal Server Error');
      } else {
        console.log('Learning added successfully');
        res.redirect('/learnings');
      }
    }
  );
});

server.post('/delete-learning', (req, res) => {
  const learningId = req.body.learningId;

  client.query(
    'DELETE FROM learnings WHERE id = $1',
    [learningId],
    (err, result) => {
      if (err) {
        console.error('Error deleting learning:', err);
        res.status(500).send('Internal Server Error');
      } else {
        console.log(`Learning with ID ${learningId} deleted successfully`);
        res.json({ success: true });
      }
    }
  );
});

server.get('/template', (req, res) => {
  client
    .query('SELECT id, pid, name, title, email, img FROM employees')
    .then(result => {
      const nodes = result.rows.map(row => ({
        id: row.id !== null ? row.id.toString() : null,
        pid: row.pid !== null ? row.pid.toString() : null,
        name: row.name,
        title: row.title,
        email: row.email,
        img: row.img,
      }));

      res.render('pages/template', {
        currentPage: 'template',
        nodes: nodes,
        req: req,
      });
    })
    .catch(error => console.error(error));
});

server.post('/update-user', async (req, res) => {
  const { user_id, name, title, email, img } = req.body;

  try {
    await client.query(
      'UPDATE employees SET name = $1, title = $2, email = $3, img = $4 WHERE id = $5',
      [name, title, email, img, user_id]
    );

    await client.query('UPDATE login_data SET email = $1 WHERE id = $2', [
      email,
      user_id,
    ]);

    console.log('User updated successfully');
    res.json({ success: true });
  } catch (error) {
    console.error('Error updating data in PostgreSQL:', error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
});

server.post('/delete-user', async (req, res) => {
  const { user_id } = req.body;

  try {
    await client.query('DELETE FROM employees WHERE id = $1', [user_id]);
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.json({ success: false, error: 'Internal Server Error' });
  }
});

server.post('/add-user', async (req, res) => {
  const { user_pid } = req.body;
  try {
    await client.query('INSERT INTO employees (pid) VALUES ($1)', [user_pid]);
    res.json({ success: true });
  } catch (error) {
    console.error('Error adding user:', error);
    res.json({ success: false, error: 'Internal Server Error' });
  }
});

server.get('/calendar', async (req, res) => {
  client
    .query('SELECT * FROM events')
    .then(result => {
      const events = result.rows.map(row => ({
        id: row.id !== undefined ? row.id : null,
        groupId: row.groupId !== undefined ? row.groupId : null,
        title: row.title,
        start: row.start,
        end: row.end !== undefined ? row.end : null,
        url: row.url !== undefined ? row.url : null,
      }));

      res.render('pages/calendar', {
        currentPage: 'calendar',
        events: events,
        req: req,
      });
    })
    .catch(error => console.error(error));
});

server.post('/events', async (req, res) => {
  const { title, start, end } = req.body;

  try {
    const result = await client.query(
      `
      INSERT INTO events (title, "start", "end")
      VALUES ($1, $2, $3)
      RETURNING id;
    `,
      [title, start, end]
    );

    const id = result.rows[0].id;
    res.status(201).json({ id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Unable to create event' });
  }
});

server.delete('/events/:id', async (req, res) => {
  const eventId = req.params.id;

  try {
    await client.query('DELETE FROM events WHERE id = $1', [eventId]);
    res.sendStatus(200);
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
});

server.post('/settings-name', async (req, res) => {
  const email = req.cookies.email;
  const { name } = req.body;

  try {
    if (name) {
      await client.query('UPDATE employees SET name = $1 WHERE email = $2', [
        name,
        email,
      ]);
    }

    res.redirect('/profile');
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
});

server.post('/settings-phone', async (req, res) => {
  const email = req.cookies.email;
  const { phone } = req.body;

  try {
    if (phone) {
      await client.query('UPDATE employees SET phone = $1 WHERE email = $2', [
        phone,
        email,
      ]);
    }

    res.redirect('/profile');
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
});

server.post('/feedback', async (req, res) => {
  const email = req.cookies.email;
  const { feedback } = req.body;
  const id = req.cookies.id;
  try {
    await client.query(
      'INSERT INTO feedbacks (email, feedback, employee_id) VALUES ($1, $2, $3)',
      [email, feedback, id]
    );

    res.redirect('/settings');
  } catch (error) {
    console.error(error);
    res.status(500).send('Failed to submit feedback.');
  }
});

server.get('/tasks', async (req, res) => {
  const employee_id = req.query.employee_id;
  try {
    const result = await client.query(
      'SELECT * FROM tasks WHERE employee_id = $1',
      [employee_id]
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
});

server.post('/add-todo', async (req, res) => {
  const employee_id = req.query.employee_id;
  const { todo_name } = req.body;
  const column_id = 'todo';
  try {
    client.query(
      'INSERT INTO tasks (task_name, column_id, employee_id) VALUES ($1, $2, $3)',
      [todo_name, column_id, employee_id],

      (err, result) => {
        if (err) {
          console.error('Error inserting data into PostgreSQL:', err);
          res.status(500).send('Internal Server Error');
        } else {
          res.redirect('back');
          console.log('Todo added successfully');
        }
      }
    );
  } catch (error) {
    console.error('Error adding tasks:', error);
    res.status(500).json({ error: 'Failed to add tasks' });
  }
});

server.put('/tasks/:task_id', async (req, res) => {
  const { task_id } = req.params;
  const { column_id } = req.body;
  try {
    await client.query('UPDATE tasks SET column_id = $2 WHERE task_id = $1', [
      task_id,
      column_id,
    ]);
    res.sendStatus(200);
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
});
server.get('/change-lang/:lang', (req, res) => {
  res.cookie('locale', req.params.lang);
  res.redirect('back');
});

server.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
