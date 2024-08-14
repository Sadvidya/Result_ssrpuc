const express = require('express');
const mysql = require('mysql2');
const app = express();
const port = 3000;

// MySQL connection
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'puc_result'  // Replace with your actual database name
});

connection.connect(err => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
        process.exit(1);  // Exit the process if the connection fails
    }
    console.log('Connected to MySQL');
});

// API endpoint to search for a student and get their grades
app.get('/search', (req, res) => {
    const name = req.query.name;
    
    if (!name) {
        return res.status(400).send('Name query parameter is required');
    }

    const searchName = `%${name}%`;

    // SQL query with parameterized values
    const query = `
        SELECT lastname, firstname, email, 'Physics' AS subject, grade AS grade FROM Physics WHERE firstname LIKE ? OR lastname LIKE ?
        UNION ALL
        SELECT lastname, firstname, email, 'Chemistry' AS subject, grade AS grade FROM Chemistry WHERE firstname LIKE ? OR lastname LIKE ?
        UNION ALL
        SELECT lastname, firstname, email, 'Mathematics' AS subject, grade AS grade FROM Mathematics WHERE firstname LIKE ? OR lastname LIKE ?
        UNION ALL
        SELECT lastname, firstname, email, 'Biology' AS subject, grade AS grade FROM Biology WHERE firstname LIKE ? OR lastname LIKE ?
        UNION ALL
        SELECT lastname, firstname, email, 'Computer Science' AS subject, grade AS grade FROM ComputerScience WHERE firstname LIKE ? OR lastname LIKE ?
        UNION ALL
        SELECT lastname, firstname, email, 'Kannada' AS subject, grade AS grade FROM Kannada WHERE firstname LIKE ? OR lastname LIKE ?
        UNION ALL
        SELECT lastname, firstname, email, 'Hindi' AS subject, grade AS grade FROM Hindi WHERE firstname LIKE ? OR lastname LIKE ?
        UNION ALL
        SELECT lastname, firstname, email, 'Sanskrit' AS subject, grade AS grade FROM Sanskrit WHERE firstname LIKE ? OR lastname LIKE ?
        UNION ALL
        SELECT lastname, firstname, email, 'Basic Mathematics' AS subject, grade AS grade FROM BasicMathematics WHERE firstname LIKE ? OR lastname LIKE ?
        UNION ALL
        SELECT lastname, firstname, email, 'English' AS subject, grade AS grade FROM English WHERE firstname LIKE ? OR lastname LIKE ?
    `;

    const params = Array(20).fill(searchName);

    connection.query(query, params, (err, results) => {
        if (err) {
            console.error('Error fetching data:', err);
            return res.status(500).send('Internal Server Error');
        }
        res.json(results);
    });
});

// Serve static files from the "public" directory
app.use(express.static('public'));

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
